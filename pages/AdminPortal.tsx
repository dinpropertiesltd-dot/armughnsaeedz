
import React, { useState, useRef, useMemo } from 'react';
import { authProvider } from '../supabase';
import { PropertyFile, User, Notice, Message } from '../types';
import { 
  Users, 
  RefreshCw,
  FileText,
  Database,
  HardDrive,
  CheckCircle2,
  CloudLightning,
  Loader2
} from 'lucide-react';

interface AdminPortalProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
  allFiles: PropertyFile[];
  setAllFiles: React.Dispatch<React.SetStateAction<PropertyFile[]>>;
  messages: Message[];
  onSendMessage: (msg: Message) => void;
  onImportFullDatabase: (data: { users: User[], files: PropertyFile[] }, isDestructive?: boolean) => void;
  onResetDatabase: () => void;
  isLocalDataPinned: boolean;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ 
  users, 
  setUsers,
  notices,
  setNotices,
  allFiles, 
  setAllFiles,
  messages,
  onSendMessage,
  onImportFullDatabase,
  onResetDatabase,
  isLocalDataPinned
}) => {
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [isProcessing, setIsProcessing] = useState(false);
  const [syncPhase, setSyncPhase] = useState('IDLE');
  const [importSummary, setImportSummary] = useState<any>(null);
  const masterSyncRef = useRef<HTMLInputElement>(null);

  const stats = useMemo(() => {
    let collection = 0, os = 0;
    allFiles.forEach(f => {
      f.transactions.forEach(t => collection += (t.amount_paid || 0));
      os += f.balance;
    });
    return { collection, os, count: allFiles.length, users: users.length };
  }, [allFiles, users]);

  const parseCSVLine = (line: string) => {
    const result = [];
    let cell = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') { cell += '"'; i++; } else { inQuotes = !inQuotes; }
      } else if (char === ',' && !inQuotes) {
        result.push(cell.trim());
        cell = '';
      } else { cell += char; }
    }
    result.push(cell.trim());
    return result;
  };

  const handleMasterSync = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    setSyncPhase('PARSING');
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const result = event.target?.result;
        if (typeof result !== 'string') throw new Error("Could not read file as string.");
        const text = result.replace(/^\uFEFF/, '');
        const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
        if (lines.length < 2) throw new Error("File empty.");
        const rawHeaders = parseCSVLine(lines[0]);
        const normH = rawHeaders.map(h => h.trim().toLowerCase());
        const col = (arr: string[], names: string[]) => {
          const i = names.findIndex(n => normH.includes(n.toLowerCase()));
          const idx = normH.indexOf(names[i]?.toLowerCase());
          return idx !== -1 ? arr[idx]?.trim() : undefined;
        };
        const parseVal = (v: any) => {
          if (!v || v === 'NULL' || v === '-') return 0;
          return parseFloat(v.toString().replace(/[^0-9.-]/g, '')) || 0;
        };
        const fileMap = new Map();
        lines.slice(1).forEach((line) => {
          const cols = parseCSVLine(line);
          const itemCode = col(cols, ['itemcode', 'file_no']) || '';
          if (!itemCode) return;
          if (!fileMap.has(itemCode)) {
            fileMap.set(itemCode, {
              fileNo: itemCode, plotSize: col(cols, ['dscription']) || 'Plot',
              plotValue: parseVal(col(cols, ['doctotal'])), balance: 0,
              paymentReceived: 0, ownerCNIC: col(cols, ['cnic']), transactions: []
            });
          }
          const prop = fileMap.get(itemCode);
          prop.paymentReceived += parseVal(col(cols, ['reconsum']));
          prop.balance += parseVal(col(cols, ['balduedeb']));
        });
        const filesArray = Array.from(fileMap.values());
        setSyncPhase('SYNCING');
        const syncResult = await authProvider.bulkSyncToCloud(filesArray);
        if (!syncResult.success) throw new Error(syncResult.error);
        alert("Sync Complete.");
      } catch (err: any) {
        alert(`Sync Failed: ${err.message}`);
      } finally {
        setIsProcessing(false);
        setSyncPhase('IDLE');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Command Center</h1>
        <div className="flex gap-4">
          <input type="file" ref={masterSyncRef} className="hidden" accept=".csv" onChange={handleMasterSync} />
          <button 
            disabled={isProcessing}
            onClick={() => masterSyncRef.current?.click()}
            className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <CloudLightning size={18} />}
            Master Registry Sync
          </button>
          <button 
            onClick={onResetDatabase}
            className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 text-red-600 rounded-2xl text-[11px] font-black uppercase hover:bg-red-50 transition-all shadow-sm"
          >
            <RefreshCw size={18} /> Purge Cache
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Assets</p>
            <h4 className="text-3xl font-black text-slate-900">{stats.count}</h4>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Collection</p>
            <h4 className="text-3xl font-black text-emerald-600">{new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(stats.collection)}</h4>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Outstanding Balance</p>
            <h4 className="text-3xl font-black text-rose-600">{new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(stats.os)}</h4>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Member Registry</p>
            <h4 className="text-3xl font-black text-slate-900">{stats.users}</h4>
         </div>
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4">System Node Synchronization</h2>
          <p className="text-slate-400 text-sm max-w-2xl font-medium leading-relaxed">
            The Master Registry Sync allows administrative officers to bulk-update property records directly from SAP Business One exports. 
            All financial transactions, payment plans, and ownership changes will be synchronized across the cloud infrastructure.
          </p>
          {syncPhase !== 'IDLE' && (
            <div className="mt-8 flex items-center gap-4 text-emerald-400">
              <Loader2 className="animate-spin" size={24} />
              <span className="text-xs font-black uppercase tracking-widest">{syncPhase} PHASE ACTIVE...</span>
            </div>
          )}
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      </div>
    </div>
  );
};

export default AdminPortal;

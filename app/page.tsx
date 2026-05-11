"use client";

import { useState, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Country, State, City } from "country-state-city";
import { toWords } from "number-to-words";

export default function Home() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [counter, setCounter] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialForm = {
    empCode: "",
    name: "",
    father: "",
    mother: "",
    email: "",
    mobile: "",
    secondaryMobile: "",
    gender: "Male",
    maritalStatus: "Single",
    nationality: "IN",
    state: "",
    city: "",
    pincode: "",
    aadhaar: "",
    pan: "",
    designation: "",
    basicSalary: "",
    allowance: "",
    bankName: "",
    accountNo: "",
    ifsc: "",
    address: "",
    joining: "",
    employeeType: "Skilled",
    manager: "",
    projectName: "Rudisco Churu Water & Sewerage Network"
  };

  const [form, setForm] = useState(initialForm);

  // --- Location Logic Fix ---
  const countries = useMemo(() => Country.getAllCountries(), []);
  const states = useMemo(() => form.nationality ? State.getStatesOfCountry(form.nationality) : [], [form.nationality]);
  const cities = useMemo(() => (form.nationality && form.state) ? City.getCitiesOfState(form.nationality, form.state) : [], [form.nationality, form.state]);

  const getNextID = () => `AKS${String(counter).padStart(4, '0')}`;

  const saveOrUpdate = () => {
    if (!form.name || !form.basicSalary) return alert("Kripya Naam aur Salary bharein!");
    if (editingId) {
      setEmployees(employees.map(emp => emp.empCode === editingId ? form : emp));
      setEditingId(null);
    } else {
      const newEmp = { ...form, empCode: getNextID() };
      setEmployees([...employees, newEmp]);
      setCounter(counter + 1);
    }
    setForm(initialForm);
  };

  const downloadSalarySlip = (emp: any) => {
    const doc = new jsPDF();
    const basic = Number(emp.basicSalary) || 0;
    const alw = Number(emp.allowance) || 0;
    const total = basic + alw;
    const words = toWords(total).toUpperCase() + " RUPEES ONLY";

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("AK & SONS", 105, 18, { align: "center" });
    doc.setFontSize(10);
    doc.text(emp.projectName, 105, 28, { align: "center" });

    autoTable(doc, {
      startY: 45,
      head: [['Description', 'Details', 'Component', 'Amount']],
      body: [
        ['Emp ID', emp.empCode, 'Basic Salary', `INR ${basic}`],
        ['Name', emp.name, 'Allowances', `INR ${alw}`],
        ['Mobile', emp.mobile, 'Gross Total', `INR ${total}`],
        ['Bank', emp.bankName, 'Account No', emp.accountNo],
        ['Address', `${emp.city}, ${emp.state}`, 'PAN No', emp.pan],
      ],
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`AMOUNT IN WORDS: ${words}`, 14, finalY);
    doc.text("__________________________", 20, finalY + 30);
    doc.text("Employee Signature", 25, finalY + 37);
    doc.text("__________________________", 140, finalY + 30);
    doc.text("Authorised Signatory", 145, finalY + 37);
    doc.save(`${emp.empCode}_Slip.pdf`);
  };

  // Styling constant
  const inputStyle = {
    border: "2.5px solid #64748b", // Bold Slate Border
    borderRadius: "0.75rem",
    padding: "0.85rem",
    backgroundColor: "#ffffff",
    width: "100%",
    outline: "none",
    fontWeight: "700",
    color: "#0f172a",
    fontSize: "14px"
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Branding */}
        <div className="bg-[#0f172a] text-white p-10 rounded-[2.5rem] shadow-2xl mb-10 border-b-8 border-amber-500 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter">AK & SONS</h1>
            <p className="text-amber-400 font-bold text-sm tracking-widest mt-2 uppercase">{form.projectName}</p>
          </div>
          <div className="text-right bg-white/10 p-5 rounded-2xl border border-white/20">
            <p className="text-[10px] text-slate-300 font-black uppercase">Next Entry ID</p>
            <p className="text-3xl font-black text-amber-500 tracking-widest">{editingId || getNextID()}</p>
          </div>
        </div>

        {/* Master Form */}
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-200 mb-10">
          
          <div className="space-y-12">
            {/* 1. PERSONAL INFO */}
            <section>
              <h2 className="text-amber-600 font-black text-xs uppercase tracking-[0.4em] mb-8 border-l-4 border-amber-500 pl-4">1. Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex flex-col gap-1.5"><label className="label-style">Full Name</label><input style={inputStyle} value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} /></div>
                <div className="flex flex-col gap-1.5"><label className="label-style">Father's Name</label><input style={inputStyle} value={form.father} onChange={(e)=>setForm({...form, father: e.target.value})} /></div>
                <div className="flex flex-col gap-1.5"><label className="label-style">Mother's Name</label><input style={inputStyle} value={form.mother} onChange={(e)=>setForm({...form, mother: e.target.value})} /></div>
                <div className="flex flex-col gap-1.5"><label className="label-style">Email Address</label><input style={inputStyle} type="email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} /></div>
                <div className="flex flex-col gap-1.5"><label className="label-style">Mobile Number</label><input style={inputStyle} value={form.mobile} onChange={(e)=>setForm({...form, mobile: e.target.value})} /></div>
                <div className="flex flex-col gap-1.5"><label className="label-style">Secondary Mobile</label><input style={inputStyle} value={form.secondaryMobile} onChange={(e)=>setForm({...form, secondaryMobile: e.target.value})} /></div>
                <div className="flex flex-col gap-1.5"><label className="label-style">Gender</label>
                  <select style={inputStyle} value={form.gender} onChange={(e)=>setForm({...form, gender: e.target.value})}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5"><label className="label-style">Marital Status</label>
                  <select style={inputStyle} value={form.maritalStatus} onChange={(e)=>setForm({...form, maritalStatus: e.target.value})}>
                    <option>Single</option><option>Married</option><option>Divorced</option>
                  </select>
                </div>
              </div>
            </section>

            {/* 2. ADDRESS INFO */}
            <section>
              <h2 className="text-amber-600 font-black text-xs uppercase tracking-[0.4em] mb-8 border-l-4 border-amber-500 pl-4">2. Address & Nationality</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex flex-col gap-1.5"><label className="label-style">Nationality</label>
                  <select style={inputStyle} value={form.nationality} onChange={(e)=>setForm({...form, nationality: e.target.value, state: "", city: ""})}>
                    {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5"><label className="label-style">State</label>
                  <select style={inputStyle} value={form.state} onChange={(e)=>setForm({...form, state: e.target.value, city: ""})}>
                    <option value="">Select State</option>
                    {states.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5"><label className="label-style">City</label>
                  <select style={inputStyle} value={form.city} onChange={(e)=>setForm({...form, city: e.target.value})}>
                    <option value="">Select City</option>
                    {cities.map(ct => <option key={ct.name} value={ct.name}>{ct.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5"><label className="label-style">Pincode</label><input style={inputStyle} maxLength={6} value={form.pincode} onChange={(e)=>setForm({...form, pincode: e.target.value.replace(/\D/g,'')})} /></div>
                <div className="flex flex-col gap-1.5 md:col-span-2"><label className="label-style">Full Local/Site Address</label><input style={inputStyle} value={form.address} onChange={(e)=>setForm({...form, address: e.target.value})} /></div>
              </div>
            </section>

            {/* 3. SALARY INFO */}
            <section>
              <h2 className="text-amber-600 font-black text-xs uppercase tracking-[0.4em] mb-8 border-l-4 border-amber-500 pl-4">3. Salary & Job Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex flex-col gap-1.5"><label className="text-[10px] font-black text-blue-600">BASIC SALARY (₹)</label><input type="number" style={{...inputStyle, border: "2.5px solid #3b82f6"}} value={form.basicSalary} onChange={(e)=>setForm({...form, basicSalary: e.target.value})} /></div>
                <div className="flex flex-col gap-1.5"><label className="text-[10px] font-black text-blue-600">ALLOWANCE (₹)</label><input type="number" style={{...inputStyle, border: "2.5px solid #3b82f6"}} value={form.allowance} onChange={(e)=>setForm({...form, allowance: e.target.value})} /></div>
                <div className="flex flex-col gap-1.5"><label className="label-style">Designation</label><input style={inputStyle} value={form.designation} onChange={(e)=>setForm({...form, designation: e.target.value})} /></div>
                <div className="flex flex-col gap-1.5"><label className="label-style">Reporting Manager</label><input style={inputStyle} value={form.manager} onChange={(e)=>setForm({...form, manager: e.target.value})} /></div>
                <div className="flex flex-col gap-1.5"><label className="label-style">PAN Number</label><input style={inputStyle} maxLength={10} value={form.pan} onChange={(e)=>setForm({...form, pan: e.target.value.toUpperCase()})} /></div>
                <div className="flex flex-col gap-1.5"><label className="label-style">Aadhaar Number</label><input style={inputStyle} maxLength={12} value={form.aadhaar} onChange={(e)=>setForm({...form, aadhaar: e.target.value})} /></div>
                <div className="flex flex-col gap-1.5"><label className="label-style">Joining Date</label><input type="date" style={inputStyle} value={form.joining} onChange={(e)=>setForm({...form, joining: e.target.value})} /></div>
              </div>
            </section>

            {/* 4. BANK INFO */}
            <section>
              <h2 className="text-amber-600 font-black text-xs uppercase tracking-[0.4em] mb-8 border-l-4 border-amber-500 pl-4">4. Banking Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1.5"><label className="label-style">Bank Name</label><input style={inputStyle} value={form.bankName} onChange={(e)=>setForm({...form, bankName: e.target.value})} /></div>
                <div className="flex flex-col gap-1.5"><label className="label-style">Account Number</label><input style={inputStyle} value={form.accountNo} onChange={(e)=>setForm({...form, accountNo: e.target.value})} /></div>
                <div className="flex flex-col gap-1.5"><label className="label-style">IFSC Code</label><input style={inputStyle} value={form.ifsc} onChange={(e)=>setForm({...form, ifsc: e.target.value.toUpperCase()})} /></div>
              </div>
            </section>
          </div>

          <button onClick={saveOrUpdate} className="mt-12 bg-slate-900 text-white px-16 py-5 rounded-2xl font-black text-lg hover:bg-amber-600 shadow-2xl transition-all">
            {editingId ? "UPDATE STAFF RECORD" : "SAVE TO AK & SONS RECORDS"}
          </button>
        </div>

        {/* Dashboard Table */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
           <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-black text-lg">Staff Master Dashboard</h3>
              <button onClick={() => {
                const ws = XLSX.utils.json_to_sheet(employees);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Employees");
                XLSX.writeFile(wb, "AK_Sons_Staff_List.xlsx");
              }} className="bg-green-600 px-4 py-2 rounded-lg text-xs font-bold shadow-lg">EXPORT EXCEL</button>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b">
                   <th className="p-8">ID</th>
                   <th className="p-8">Name</th>
                   <th className="p-8">Salary</th>
                   <th className="p-8 text-center">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 font-bold">
                 {employees.map((emp, i) => (
                   <tr key={i} className="hover:bg-amber-50/50 transition-colors">
                     <td className="p-8 font-mono">{emp.empCode}</td>
                     <td className="p-8">{emp.name}</td>
                     <td className="p-8 text-emerald-700">₹{(Number(emp.basicSalary)||0) + (Number(emp.allowance)||0)}</td>
                     <td className="p-8 flex justify-center gap-2">
                       <button onClick={()=>downloadSalarySlip(emp)} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px]">SLIP</button>
                       <button onClick={()=>{setForm(emp); setEditingId(emp.empCode); window.scrollTo(0,0)}} className="bg-amber-500 text-white px-4 py-2 rounded-xl text-[10px]">EDIT</button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
      <style jsx>{`.label-style { @apply text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1; }`}</style>
    </div>
  );
}
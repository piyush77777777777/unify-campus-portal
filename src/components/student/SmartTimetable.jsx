import React, { useState } from "react";
import { Clock, MapPin, User, BookOpen, Navigation, Bell } from "lucide-react";

const TIMETABLE = {
  Monday:[
    {time:"09:00-10:00",subject:"Operating Systems",code:"CST301",teacher:"Dr. Avinash Kumar",block:"Block B",floor:3,room:"B-301",type:"Theory",color:"bg-blue-500"},
    {time:"10:00-11:00",subject:"DBMS",code:"CST303",teacher:"Prof. S. Panda",block:"Block A",floor:2,room:"A-201",type:"Theory",color:"bg-purple-500"},
    {time:"11:15-12:15",subject:"Computer Networks",code:"CST305",teacher:"Dr. R. Nayak",block:"Block A",floor:2,room:"A-202",type:"Theory",color:"bg-indigo-500"},
    {time:"02:00-04:00",subject:"OS Lab",code:"CSL301",teacher:"Dr. Avinash Kumar",block:"Block B",floor:1,room:"B-101",type:"Lab",color:"bg-emerald-500"},
  ],
  Tuesday:[
    {time:"09:00-10:00",subject:"Algorithms",code:"CST302",teacher:"Prof. M. Behera",block:"Block B",floor:3,room:"B-302",type:"Theory",color:"bg-rose-500"},
    {time:"10:00-11:00",subject:"Machine Learning",code:"CSE401",teacher:"Dr. P. Das",block:"Block B",floor:3,room:"B-303",type:"Theory",color:"bg-orange-500"},
    {time:"11:15-12:15",subject:"Software Engineering",code:"CST304",teacher:"Prof. A. Mohanty",block:"Block A",floor:3,room:"A-301",type:"Theory",color:"bg-teal-500"},
    {time:"02:00-04:00",subject:"ML Lab",code:"CSL401",teacher:"Dr. P. Das",block:"Block B",floor:3,room:"B-303",type:"Lab",color:"bg-cyan-500"},
  ],
  Wednesday:[
    {time:"09:00-10:00",subject:"Operating Systems",code:"CST301",teacher:"Dr. Avinash Kumar",block:"Block B",floor:3,room:"B-301",type:"Theory",color:"bg-blue-500"},
    {time:"10:00-11:00",subject:"Algorithms",code:"CST302",teacher:"Prof. M. Behera",block:"Block B",floor:3,room:"B-302",type:"Theory",color:"bg-rose-500"},
    {time:"11:15-01:15",subject:"Networks Lab",code:"CSL305",teacher:"Dr. R. Nayak",block:"Block B",floor:1,room:"B-102",type:"Lab",color:"bg-indigo-500"},
  ],
  Thursday:[
    {time:"09:00-10:00",subject:"DBMS",code:"CST303",teacher:"Prof. S. Panda",block:"Block A",floor:2,room:"A-201",type:"Theory",color:"bg-purple-500"},
    {time:"10:00-11:00",subject:"Machine Learning",code:"CSE401",teacher:"Dr. P. Das",block:"Block B",floor:3,room:"B-303",type:"Theory",color:"bg-orange-500"},
    {time:"02:00-04:00",subject:"DBMS Lab",code:"CSL303",teacher:"Prof. S. Panda",block:"Block B",floor:1,room:"B-103",type:"Lab",color:"bg-purple-500"},
  ],
  Friday:[
    {time:"09:00-10:00",subject:"Software Engineering",code:"CST304",teacher:"Prof. A. Mohanty",block:"Block A",floor:3,room:"A-301",type:"Theory",color:"bg-teal-500"},
    {time:"10:00-11:00",subject:"Computer Networks",code:"CST305",teacher:"Dr. R. Nayak",block:"Block A",floor:2,room:"A-202",type:"Theory",color:"bg-indigo-500"},
    {time:"11:15-12:15",subject:"Algorithms",code:"CST302",teacher:"Prof. M. Behera",block:"Block B",floor:3,room:"B-302",type:"Theory",color:"bg-rose-500"},
  ],
  Saturday:[{time:"10:00-01:00",subject:"Project / Mini Project",code:"CSP401",teacher:"Dr. Avinash Kumar",block:"Block B",floor:4,room:"B-402",type:"Project",color:"bg-amber-500"}],
  Sunday:[],
};

const DAYS=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const todayIdx=new Date().getDay()===0?6:new Date().getDay()-1;
const todayName=DAYS[todayIdx];

export default function SmartTimetable(){
  const [selectedDay,setSelectedDay]=useState(todayName);
  const classes=TIMETABLE[selectedDay]||[];
  const now=new Date();
  const curH=now.getHours()+now.getMinutes()/60;
  const toH=t=>{const[h,m]=t.split(":").map(Number);return h+m/60;};
  const isOngoing=t=>{const[s,e]=t.split("-");return curH>=toH(s)&&curH<toH(e);};
  const isUpcoming=t=>curH<toH(t.split("-")[0]);
  const nextClass=classes.find(c=>isUpcoming(c.time));

  return(
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-bold border border-indigo-500/30 mb-3">
          <BookOpen className="w-3.5 h-3.5"/> Smart Timetable — Live Classroom Locator
        </div>
        <h2 className="text-2xl font-black">My Class Schedule 📅</h2>
        <p className="text-xs text-indigo-100/80 mt-1">Room • Block • Floor • Teacher — all in one place</p>
        {nextClass&&(
          <div className="mt-4 p-3 bg-white/10 rounded-2xl border border-white/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-xl flex-shrink-0">⏰</div>
            <div>
              <div className="text-xs text-indigo-200 font-bold uppercase">Next Class</div>
              <div className="font-bold text-white">{nextClass.subject} — {nextClass.time}</div>
              <div className="text-xs text-indigo-200">{nextClass.block} • Floor {nextClass.floor} • Room {nextClass.room}</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl overflow-x-auto">
        {DAYS.map(day=>(
          <button key={day} onClick={()=>setSelectedDay(day)}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${selectedDay===day?"bg-indigo-600 text-white shadow":"text-slate-600 hover:text-slate-900"} ${day===todayName?"ring-2 ring-amber-400 ring-offset-1":""}`}>
            {day.substring(0,3)}{day===todayName&&<span className="ml-1 text-[9px] text-amber-300">●</span>}
          </button>
        ))}
      </div>

      {classes.length>0?(
        <div className="space-y-3">
          {classes.map((cls,i)=>{
            const ongoing=selectedDay===todayName&&isOngoing(cls.time);
            const upcoming=selectedDay===todayName&&isUpcoming(cls.time);
            return(
              <div key={i} className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden ${ongoing?"border-emerald-400 shadow-emerald-100":upcoming?"border-blue-200":"border-slate-100 opacity-75"}`}>
                <div className={`h-1.5 ${cls.color}`}/>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full text-white ${cls.color}`}>{cls.code}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls.type==="Lab"?"bg-emerald-100 text-emerald-700":cls.type==="Project"?"bg-amber-100 text-amber-700":"bg-blue-100 text-blue-700"}`}>{cls.type}</span>
                        {ongoing&&<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white animate-pulse">🟢 ONGOING</span>}
                        {upcoming&&!ongoing&&<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">UPCOMING</span>}
                      </div>
                      <h3 className="font-bold text-slate-900 mt-1.5">{cls.subject}</h3>
                      <div className="flex items-center gap-1 mt-1"><User className="w-3 h-3 text-slate-400"/><span className="text-xs text-slate-500">{cls.teacher}</span></div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 justify-end"><Clock className="w-3 h-3 text-slate-400"/><span className="text-xs font-bold text-slate-700">{cls.time}</span></div>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${cls.color} flex items-center justify-center flex-shrink-0`}><MapPin className="w-4 h-4 text-white"/></div>
                      <div><div className="text-xs font-black text-slate-900">{cls.room}</div><div className="text-[10px] text-slate-500">{cls.block} • Floor {cls.floor}</div></div>
                    </div>
                    <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-600 text-white text-[10px] font-bold cursor-pointer"><Navigation className="w-3 h-3"/>Navigate</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ):(
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="font-bold text-slate-900">No classes today!</h3>
          <p className="text-xs text-slate-500 mt-1">Enjoy your day off</p>
        </div>
      )}
    </div>
  );
}
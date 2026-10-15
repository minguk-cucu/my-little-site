export function key(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
export function shift(day,n){const d=new Date(day+'T12:00:00');d.setDate(d.getDate()+n);return key(d);}
const dayNumber=day=>Date.parse(day+'T00:00:00Z')/86400000;
export function scheduled(routine,day){
 const start=routine.start||routine.created;
 if(day<start||(routine.end&&day>routine.end))return false;
 if(routine.frequency==='weekly')return (routine.weekdays||[]).includes(new Date(day+'T12:00:00').getDay());
 if(routine.frequency==='interval')return (dayNumber(day)-dayNumber(start))%(routine.interval||1)===0;
 return true;
}
export function latestScheduled(routine,day){
 const start=routine.start||routine.created;
 if(routine.end&&day>routine.end)day=routine.end;
 if(day<start)return null;
 if(routine.frequency==='interval')return shift(day,-((dayNumber(day)-dayNumber(start))%(routine.interval||1)));
 if(routine.frequency==='weekly'){
  for(let i=0;i<7&&day>=start;i++,day=shift(day,-1)){if(scheduled(routine,day))return day;}
  return null;
 }
 return day;
}
export function streak(records,id,today,routine){
 // Existing daily routines keep their original schedule when no new fields exist.
 routine??={created:'0001-01-01'};
 let day=latestScheduled(routine,today),count=0;
 if(day===today&&!records[day]?.[id]?.done)day=latestScheduled(routine,shift(day,-1));
 while(day&&records[day]?.[id]?.done){count++;day=latestScheduled(routine,shift(day,-1));}
 return count;
}
export function scheduleLabel(routine){
 if(routine.frequency==='weekly')return '매주 '+(routine.weekdays||[]).map(d=>['일','월','화','수','목','금','토'][d]).join('·');
 if(routine.frequency==='interval')return `${routine.interval}일마다`;
 return '매일';
}
export function validateSchedule({start,end,frequency,weekdays,interval}){
 const valid=day=>/^\d{4}-\d{2}-\d{2}$/.test(day)&&Number.isFinite(Date.parse(day+'T12:00:00'))&&key(new Date(day+'T12:00:00'))===day;
 if(!valid(start)||(end&&!valid(end)))return '올바른 시작일과 종료일을 입력해 주세요.';
 if(end&&end<start)return '종료일은 시작일과 같거나 이후여야 합니다.';
 if(frequency==='weekly'&&!weekdays.length)return '반복할 요일을 하나 이상 선택해 주세요.';
 if(frequency==='interval'&&(!Number.isInteger(interval)||interval<1||interval>365))return '반복 간격은 1~365 사이의 정수로 입력해 주세요.';
 if(end&&!latestScheduled({start,end,frequency,weekdays,interval},end))return '선택한 기간 안에 해당 요일이 없습니다. 기간 또는 요일을 바꿔 주세요.';
 return '';
}

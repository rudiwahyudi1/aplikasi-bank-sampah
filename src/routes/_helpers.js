function roleIs(req,...roles){return roles.includes(req.session?.user?.role);}
function num(v,d=0){const n=Number(v);return Number.isFinite(n)?n:d;}
function page(v){const n=parseInt(v,10);return Number.isInteger(n)&&n>0?n:1;}
function limit(v){const n=parseInt(v,10);return [10,25,50,100].includes(n)?n:10;}
function clean(v){return String(v??"").trim();}
module.exports={roleIs,num,page,limit,clean};

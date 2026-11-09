// [district, province, precious place, description, transport facilities]
// Transport codes: T=Train, B=Bus, X=Taxi/Tuk-tuk, A=Airport, P=Port, F=Ferry, + free text
const D = [
["Colombo","Western","Galle Face Green","An oceanfront promenade where families fly kites and eat street snacks while the sun sets over the Indian Ocean.","T B X A"],
["Gampaha","Western","Negombo Lagoon & Beach","A lively fishing town with golden sands, a calm lagoon and the freshest seafood on the west coast.","T B X A"],
["Kalutara","Western","Kalutara Bodhiya","A seaside Buddhist temple with a hollow white stupa, set right beside the Kalu river mouth.","T B X"],
["Kandy","Central","Temple of the Sacred Tooth Relic","A UNESCO World Heritage temple beside Kandy Lake that houses the relic of the Buddha's tooth.","T B X"],
["Matale","Central","Aluvihara Rock Temple","Ancient cave temple where the Buddhist scriptures were first written down on palm leaves.","B X"],
["Nuwara Eliya","Central","Gregory Lake & Tea Country","A cool hill town of tea estates, colonial houses and misty lake views, nicknamed Little England.","T B X"],
["Galle","Southern","Galle Dutch Fort","A living 16th-century fort by the sea, with cobbled streets, cafés and a historic lighthouse.","T B X"],
["Matara","Southern","Parevi Duwa Temple","A small island temple linked to the shore by a footbridge, surrounded by turquoise water.","T B X"],
["Hambantota","Southern","Yala National Park","Home to one of the world's densest leopard populations, plus elephants and sloth bears.","B X A+Mattala airport P+Hambantota port"],
["Jaffna","Northern","Nallur Kandaswamy Kovil","A grand Tamil Hindu temple with golden gopuram towers and vibrant daily festivals.","T B X A+Palaly airport F+Island ferries"],
["Kilinochchi","Northern","Iranaimadu Tank","A vast reservoir that feeds the paddy fields and is a peaceful place for bird watching.","T B X"],
["Mannar","Northern","Doric's Bungalow & Mannar Fort","A sun-baked island with a Dutch fort, baobab trees and flamingo-filled shallows.","B X F+Causeway road"],
["Vavuniya","Northern","Vavuniya Archaeological Museum","A small museum showing northern heritage, a good stop on the road to Jaffna.","T B X"],
["Mullaitivu","Northern","Chundikulam Lagoon","Quiet lagoons and untouched beaches with migrating birds in the cooler months.","B X"],
["Batticaloa","Eastern","Batticaloa Lagoon & Kallady Bridge","The 'singing fish' lagoon, with a lighthouse, a Dutch fort and calm Pasikudah beaches nearby.","T B X A+Small airfield"],
["Ampara","Eastern","Arugam Bay","Sri Lanka's best-known surf spot, with a relaxed beach village and elephant-filled Kumana park.","B X"],
["Trincomalee","Eastern","Nilaveli & Pigeon Island","White sand, clear water and coral reefs full of fish and reef sharks, perfect for snorkelling.","T B X P+Natural harbour A+Seaplane"],
["Kurunegala","North Western","Ethagala (Elephant Rock)","A giant rock shaped like an elephant, with a temple on top and views over the city.","T B X"],
["Puttalam","North Western","Kalpitiya Peninsula","A kite-surfing coast known for dolphin watching and quiet lagoon islands.","T B X"],
["Anuradhapura","North Central","Sri Maha Bodhi & Ruwanwelisaya","Sacred city of ancient kings, home to the oldest documented planted tree in the world.","T B X"],
["Polonnaruwa","North Central","Gal Vihara","Four serene Buddha statues carved from a single granite wall in the 12th century.","T B X"],
["Badulla","Uva","Dunhinda Falls","A misty waterfall reached by a forest path, famous for its rainbow spray.","T B X"],
["Monaragala","Uva","Maligawila Buddha Statue","A towering 7th-century limestone Buddha standing in quiet forest countryside.","B X"],
["Ratnapura","Sabaragamuwa","Sinharaja Rain Forest","A UNESCO rainforest rich in endemic birds, and a city famous for its gemstones.","B X"],
["Kegalle","Sabaragamuwa","Pinnawala Elephant Orphanage","Where rescued baby elephants are fed and bathed in the river each day.","T B X"]
];
const KEY = {
  T:["Train","Railway station with regular services. Check the Sri Lanka Railways timetable."],
  B:["Bus","Public (SLTB) and private buses connect the main towns daily."],
  X:["Taxi & tuk-tuk","Taxis and three-wheelers are easy to find. Call a registered taxi owner via our login area."],
  A:["Airport","Air access available."],P:["Port","Seaport access."],F:["Ferry","Boat or ferry crossing."]
};
const $ = s => document.querySelector(s);
const grid = $("#grid");

function render(filter=""){
  grid.innerHTML = "";
  D.forEach((d,i)=>{
    if(!d[0].toLowerCase().includes(filter.toLowerCase())) return;
    const c = document.createElement("article");
    c.className = "card"; c.tabIndex = 0;
    c.innerHTML = `<h3>${d[0]}</h3><span class="prov">${d[1]} Province</span><span class="place">${d[2]}</span><button class="btn small" data-i="${i}">Explore</button>`;
    c.addEventListener("click", e => { if(!e.target.closest("button")) showPlace(i); });
    c.addEventListener("keydown", e => { if(e.key==="Enter" && e.target===c) showPlace(i); });
    c.querySelector("button").addEventListener("click", () => showTransport(i));
    grid.appendChild(c);
  });
  if(!grid.children.length) grid.innerHTML = "<p>No district found. Try another name.</p>";
}
function open(m){ m.hidden = false; m.querySelector("[data-close]").focus(); }
function showPlace(i){
  const d = D[i];
  $("#pmTitle").textContent = d[2]; $("#pmDistrict").textContent = d[0] + " District";
  $("#pmDesc").textContent = d[3]; open($("#placeModal"));
}
function showTransport(i){
  const d = D[i], list = $("#tmList");
  $("#tmTitle").textContent = d[0] + " District";
  list.innerHTML = "";
  d[4].split(" ").forEach(code=>{
    const [k, extra] = code.split("+");
    const e = KEY[k]; if(!e) return;
    const li = document.createElement("li");
    li.innerHTML = `<b>${e[0]}${extra ? ": "+extra.replace(/_/g," ") : ""}</b>${e[1]}`;
    list.appendChild(li);
  });
  open($("#transModal"));
}
// fix: allow "A+Mattala airport" style extras that contain spaces
D.forEach(d=>{ d[4] = d[4].replace(/\+([^ ]+) ([^ ]+)( |$)/g,(m,a,b,c)=>"+"+a+"_"+b+c); });

document.querySelectorAll(".modal").forEach(m=>{
  m.addEventListener("click", e=>{ if(e.target===m || e.target.hasAttribute("data-close")) m.hidden = true; });
});
document.addEventListener("keydown", e=>{ if(e.key==="Escape") document.querySelectorAll(".modal").forEach(m=>m.hidden=true); });
$("#search").addEventListener("input", e=>render(e.target.value));

// Login (front-end demo only: no real authentication)
let role = "customer";
const names = {customer:"customer",taxi:"taxi owner",hotel:"hotel manager"};
function setRole(r){
  role = r; $("#roleName").textContent = names[r]; $("#msg").textContent = "";
  document.querySelectorAll("#tabs button").forEach(b=>b.classList.toggle("on", b.dataset.role===r));
}
document.querySelectorAll("#tabs button").forEach(b=>b.addEventListener("click",()=>setRole(b.dataset.role)));
$("#openLogin").addEventListener("click",()=>{ open($("#loginModal")); });
document.querySelectorAll("[data-role]").forEach(b=>{
  if(b.closest("#tabs")) return;
  b.addEventListener("click",()=>{ setRole(b.dataset.role); open($("#loginModal")); });
});
$("#loginForm").addEventListener("submit", e=>{
  e.preventDefault();
  $("#msg").textContent = "Welcome, " + names[role] + "! (Demo login. Connect a back end to make this real.)";
});
render();

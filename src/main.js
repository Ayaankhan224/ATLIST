//changing panel anim

const home=document.querySelector(".home");
const discover=document.querySelector(".discover");
const generate=document.querySelector(".generate");
const saved=document.querySelector(".saved");
const homeBtn=document.querySelector(".homeBtn");
const discoverBtn=document.querySelector(".discoverBtn");
const generateBtn=document.querySelector(".generateBtn");
const savedBtn=document.querySelector(".savedBtn");
const panels=[home,discover,generate,saved];
home.classList.add("active");
function switchPanel(activePanel){
    panels.forEach(panel=>{
        if(panel===activePanel){
            panel.classList.add("active");
            gsap.fromTo(
                panel,
                {
                    opacity:0,
                    y:25,
                    scale:0.97
                },
                {
                    opacity:1,
                    y:0,
                    scale:1,
                    duration:0.55,
                    ease:"power3.out"
                }
            );
        }
        else{
            gsap.to(panel,{
                opacity:0,
                y:-15,
                scale:0.97,
                duration:0.3,
                ease:"power2.in",
                onComplete:()=>{
                    panel.classList.remove("active");
                }
            });
        }
    });
}
homeBtn.addEventListener("click",()=>switchPanel(home));
discoverBtn.addEventListener("click",()=>switchPanel(discover));
generateBtn.addEventListener("click",()=>switchPanel(generate));
savedBtn.addEventListener("click",()=>switchPanel(saved));


//copied anim

const list=document.querySelectorAll("li");
const copied=document.querySelector(".copied");

list.forEach((li)=>{
    li.addEventListener("click",()=>{
        navigator.clipboard.writeText(li.innerText);
        gsap.timeline()
        .to(copied,{
            opacity:1,
            duration:0.25
        })
        .to(copied,{
            opacity:0,
            duration:0.25,
            delay:1
        });
    });
});

//loading anim
const loader=document.querySelector(".loader");
const generateInput=document.querySelector(".genInp");
const genBtn=document.querySelector(".genBtn");
function startLoading(){
    gsap.timeline()
    .to(genBtn,{
        color:"transparent",
        duration:0.3,
        ease:"power2.in"
    },0)
    .to(loader,{
        opacity:1,
        duration:0.3,
        ease:"power2.out",
        onStart:()=>{
            loader.classList.add("active");
        }
    },0.15);
}
function stopLoading(){
    gsap.timeline()
    .to(loader,{
        opacity:0,
        duration:0.3,
        ease:"power2.in",
        onComplete:()=>{
            loader.classList.remove("active");
        }
    },0)
    .to(genBtn,{
        color:"#e8e8e8c4",
        duration:0.3,
        ease:"power2.out"
    },0.15);
}
genBtn.addEventListener("click",()=>{
    startLoading();
    setTimeout(()=>{
        stopLoading();
    },2000);
});











// const API_KEY = import.meta.env.VITE_GEMINI_KEY;

// async function geminiTest() {
//   const response = await fetch(
//     `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${API_KEY}`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         contents: [
//           {
//             parts: [
//               {
//                 text:
//                 `Analyze this mood:

//                 "late night coding in rain"

//                 Return ONLY valid JSON.

//                 {
//                 "mood":"",
//                 "energy":0,
//                 "genres":[],
//                 "searchTerms":[],
//                 "palette":[],
//                 }

//                 Limit:
//                 - concise
//                 - max 3 genres
//                 - max 4 searchTerms
//                 - 3 colors in palette
//                 - energy 0-10
//                 `,
//               },
//             ],
//           },
//         ],
//       }),
//     },
//   );
//   const data = await response.json();
//   console.log(data);
//   console.log(data.candidates[0].content.parts[0].text);
// }
// geminiTest();

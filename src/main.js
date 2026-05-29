

//youtube embed
const results = document.querySelector(".playlist-results");
const player = document.querySelector(".youtube-player");

//saved
const savePlaylistBtn =
document.querySelector(
".savePlaylistBtn"
);

const savedSection =
document.querySelector(
".saved"
);
let currentPlaylist = [];
//changing panel anim
const home = document.querySelector(".home");
const discover = document.querySelector(".discover");
const generate = document.querySelector(".generate");
const saved = document.querySelector(".saved");
const homeBtn = document.querySelector(".homeBtn");
const discoverBtn = document.querySelector(".discoverBtn");
const generateBtn = document.querySelector(".generateBtn");
const savedBtn = document.querySelector(".savedBtn");
const panels = [home, discover, generate, saved];
home.classList.add("active");
function switchPanel(activePanel) {
  panels.forEach((panel) => {
    if (panel === activePanel) {
      panel.classList.add("active");
      gsap.fromTo(
        panel,
        {
          opacity: 0,
          y: 25,
          scale: 0.97,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: "power3.out",
        },
      );
    } else {
      gsap.to(panel, {
        opacity: 0,
        y: -15,
        scale: 0.97,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          panel.classList.remove("active");
        },
      });
    }
  });
}
homeBtn.addEventListener("click", () => switchPanel(home));
discoverBtn.addEventListener("click", () => switchPanel(discover));
generateBtn.addEventListener("click", () => switchPanel(generate));
savedBtn.addEventListener("click", () => switchPanel(saved));

//copied anim
const list = document.querySelectorAll("li");
const copied = document.querySelector(".copied");

list.forEach((li) => {
  li.addEventListener("click", () => {
    navigator.clipboard.writeText(li.innerText);
    gsap
      .timeline()
      .to(copied, {
        opacity: 1,
        duration: 0.25,
      })
      .to(copied, {
        opacity: 0,
        duration: 0.25,
        delay: 1,
      });
  });
});

//loading anim
const loader = document.querySelector(".loader");
const genInput = document.querySelector(".genInp");
const genBtn = document.querySelector(".genBtn");
function startLoading() {
  gsap
    .timeline()
    .to(
      genBtn,
      {
        color: "transparent",
        duration: 0.3,
        ease: "power2.in",
      },
      0,
    )
    .to(
      loader,
      {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        onStart: () => {
          loader.classList.add("active");
        },
      },
      0.15,
    );
}
function stopLoading() {
  gsap
    .timeline()
    .to(
      loader,
      {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          loader.classList.remove("active");
        },
      },
      0,
    )
    .to(
      genBtn,
      {
        color: "#e8e8e8c4",
        duration: 0.3,
        ease: "power2.out",
      },
      0.15,
    );
}

const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY;
const LASTFM_KEY = import.meta.env.VITE_LASTFM_KEY;
const YOUTUBE_KEY = import.meta.env.VITE_YOUTUBE_KEY;

async function generatePlaylist(mood) {
  //GEMINI
  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
                User mood:
                "${mood}"
                Return ONLY 3 music genres or artist styles.
                Example output:
                lofi hip hop, chillhop, ambient jazz
                No explanations.
                `,
              },
            ],
          },
        ],
      }),
    },
  );
  const geminiData = await geminiResponse.json();
  const searchTerm = geminiData.candidates[0].content.parts[0].text.trim();
  console.log("Gemini:", searchTerm);
  const genres = searchTerm.split(",").map((g) => g.trim());
  //lastfm
  let playlist = [];
  for (const genre of genres) {
    const lastfmresponse = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${encodeURIComponent(genre)}&api_key=${LASTFM_KEY}&format=json`,
    );
    const data = await lastfmresponse.json();
    console.log(genre, data);
    const songs = data.tracks.track || [];
    playlist.push(...songs);
  }
  console.log("FINAL PLAYLIST:", playlist);
  currentPlaylist = playlist;
  return playlist;
}
async function searchYoutube(query) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(query)}&key=${YOUTUBE_KEY}&part=snippet&type=video&maxResults=1`
    );
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].id.videoId;
    }
    return null;
  } catch (error) {
    console.error("YouTube search error:", error);
    return null;
  }
}

function embedPlayer(videoId, query) {
  const playerDiv = document.createElement("div");
  playerDiv.className = "youtube-player";
  if (videoId) {
    playerDiv.innerHTML = `
      <iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
  } else {
    playerDiv.innerHTML = `
      <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(query)}" target="_blank" style="display: inline-block; padding: 1vh 2vh; background: #ff0000; color: white; border-radius: 10px; text-decoration: none; margin-top: 2vh; cursor: pointer;">
        Play "${query}" on YouTube
      </a>
    `;
  }
  return playerDiv;
}
genBtn.addEventListener("click", async () => {
  const mood = genInput.value.trim();
  if (!mood) {
    alert("Please enter a mood!");
    return;
  }
  startLoading();
  try {
    const playlist = await generatePlaylist(mood);
    displayPlaylist(playlist);
  } catch (error) {
    console.error("Error generating playlist:", error);
    alert("Error generating playlist. Please try again.");
  } finally {
    stopLoading();
  }
});
function displayPlaylist(playlist) {
  const generateSection = document.querySelector(".generate");
  let playlistContainer = generateSection.querySelector(".playlist-container");
  if (!playlistContainer) {
    playlistContainer = document.createElement("div");
    playlistContainer.className = "playlist-container";
    generateSection.appendChild(playlistContainer);
  }
  playlistContainer.innerHTML = "<h2>Your Playlist</h2>";
  const playlistList = document.createElement("div");
  playlistList.className = "playlist-tracks";
  playlist.slice(0, 50).forEach((song, index) => {
    const artist = song.artist.name || "Unknown Artist";
    const name = song.name || "Unknown Song";
    const query = `${name} ${artist}`;
    const trackCard = document.createElement("div");
    trackCard.className = "track-card";
    trackCard.innerHTML = `
    <div class="track-number">
    ${index + 1}
    </div>
    <div class="track-info">
    <div class="track-name">
    ${name}
    </div>
    <div class="track-artist">
    ${artist}
    </div>
    </div>
    <i class="fa-solid fa-play"></i>
    `;
    trackCard.addEventListener("click", async () => {
      const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
      const existingPlayer =document.querySelector(".youtube-player");
      if(existingPlayer){
        existingPlayer.remove();
      }
      const videoId = await searchYoutube(query);
      const playerDiv = embedPlayer(videoId, query);
      playlistContainer.appendChild(playerDiv);
    });
    playlistList.appendChild(trackCard);
  });
  playlistContainer.appendChild(playlistList);
}


//savedfns
function savePlaylist(){
if(
currentPlaylist.length===0
){
alert(
"No playlist to save."
);
return;
}
let savedPlaylists =
JSON.parse(
localStorage.getItem(
"savedPlaylists"
)
)||[];
savedPlaylists.push({
id:Date.now(),
playlist:currentPlaylist
});
localStorage.setItem(
"savedPlaylists",
JSON.stringify(
savedPlaylists
)
);
alert(
"Playlist Saved!"
);
renderSaved();
}
savePlaylistBtn
.addEventListener(
"click",
savePlaylist
);
function renderSaved(){
const savedPlaylists =
JSON.parse(
localStorage.getItem(
"savedPlaylists"
)
)||[];
savedSection.innerHTML=
`
<h1>
SAVED PLAYLISTS
</h1>
`;
savedPlaylists.forEach(
(saved,index)=>{
const card =
document.createElement(
"div"
);
card.className=
"saved-card";
card.innerHTML=
`
Playlist ${index+1}
`;
card.addEventListener(
"click",
()=>{
switchPanel(
generate
);
displayPlaylist(
saved.playlist
);
});
savedSection
.appendChild(card);
});
}
renderSaved();
const API_KEY = import.meta.env.VITE_GEMINI_KEY;

async function geminiTest() {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${API_KEY}`,
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
                text:
                `Analyze this mood:

                "late night coding in rain"

                Return ONLY valid JSON.

                {
                "mood":"",
                "energy":0,
                "genres":[],
                "searchTerms":[],
                "palette":[],
                }

                Limit:
                - concise
                - max 3 genres
                - max 4 searchTerms
                - 3 colors in palette
                - energy 0-10
                `,
              },
            ],
          },
        ],
      }),
    },
  );
  const data = await response.json();
  console.log(data);
  console.log(data.candidates[0].content.parts[0].text);
}
geminiTest();

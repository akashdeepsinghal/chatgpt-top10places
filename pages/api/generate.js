import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const city = req.body.city || "";
  if (city.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid city",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(city),
      temperature: 0,
      max_tokens: 500,
    });
    console.log("completion");
    console.log(completion);
    console.log(completion.data);
    console.log(completion.data.choices);
    console.log(completion.data.choices[0]);
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(city) {
  const capitalizedCity = city[0].toUpperCase() + city.slice(1).toLowerCase();
  return `Suggest top 10 places to visit in a city.

City: New Delhi
Names:Red Fort, Qutub Minar, Humayun's Tomb, India Gate, Lotus Temple, Jama Masjid, Akshardham Temple, Chandni Chowk, Rashtrapati Bhavan, National Museum
City: London
Names:British Museum, Tower of London, Buckingham Palace, London Eye, Big Ben and the Houses of Parliament, Westminster Abbey, St. Paul's Cathedral, Trafalgar Square, Natural History Museum, Tate Modern
City: ${capitalizedCity}
Names:`;
}

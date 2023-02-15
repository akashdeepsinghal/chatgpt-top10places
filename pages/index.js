import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [cityInput, setCityInput] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setResult([]);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city: cityInput }),
      });
      setLoading(false);

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      // setResult(data.result);
      let csList =
        "Sydney Opera House, Bondi Beach, Royal Botanic Garden, Taronga Zoo, The Rocks, Sydney Harbour Bridge, Manly Beach, Queen Victoria Building, Luna Park, Sydney Tower";
      if (data.result) {
        csList = data.result;
      }

      const resultList = csList.split(", ");
      console.log("resultList");
      console.log(resultList);
      setResult(resultList);
      setCityInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Top 10 places</title>
        <link rel="icon" href="/place.png" />
      </Head>

      <main className={styles.main}>
        <img src="/place.png" className={styles.icon} />
        <h3>Top 10 places</h3>
        <p>Ask ChatGPT and Plan your travel using AI</p>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="city"
            placeholder="Enter an city"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
          />
          {/* <input disabled={loading} type="submit" value="Generate names" /> */}
          <button disabled={loading} type="submit">
            Plan my itinerary
          </button>
        </form>
        {loading ? <img src="/spinner.gif" /> : ""}

        <div className={styles.result}>
          <ol>
            {result.map((place) => (
              <li>{place}</li>
            ))}
          </ol>
        </div>
        <div className={styles.bottom}>
          An AI Experiment by ©{" "}
          <a
            href="https://www.linkedin.com/in/akashdeepsinghal/"
            target={"_blank"}
          >
            Akash Singhal
          </a>{" "}
        </div>
      </main>
    </div>
  );
}

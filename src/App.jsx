import { useState } from "react";

import "./App.css";

function App() {

  const [schermata, setSchermata] = useState("home");

  const [nomeAllenatore, setNomeAllenatore] = useState("");

  const [nomeInserito, setNomeInserito] = useState("");

  const [xp, setXp] = useState(0);

  const [collezione, setCollezione] = useState([]);

  const [query, setQuery] = useState("");

  const [risultati, setRisultati] = useState([]);

  const [loading, setLoading] = useState(false);

  const [messaggio, setMessaggio] = useState("");

  const livello = Math.floor(xp / 100) + 1;

  const xpNelLivello = xp % 100;

  function registraAllenatore() {

    if (nomeInserito.trim() === "") return;

    setNomeAllenatore(nomeInserito);

  }

  function calcolaXP(carta) {

    const rarita = carta.rarity || "";

    if (rarita.includes("Secret")) return 200;

    if (rarita.includes("Ultra")) return 120;

    if (rarita.includes("Holo")) return 80;

    if (rarita.includes("Rare")) return 50;

    return 10;

  }

  async function cercaCarta() {

    if (query.trim() === "") return;

    setLoading(true);

    setMessaggio("");

    try {

      const risposta = await fetch(

        `https://api.pokemontcg.io/v2/cards?q=name:${query}*&pageSize=8`

      );

      const dati = await risposta.json();

      setRisultati(dati.data || []);

    } catch (errore) {

      alert("Errore nel caricamento delle carte");

      console.log(errore);

    }

    setLoading(false);

  }

  function aggiungiCarta(carta) {

    const giaPresente = collezione.some((c) => c.id === carta.id);

    let xpGuadagnati = calcolaXP(carta);

    if (giaPresente) {

      xpGuadagnati = 5;

      setMessaggio(`Duplicato trovato: ${carta.name}. +5 XP`);

    } else {

      setMessaggio(`Nuova carta scoperta: ${carta.name}! +${xpGuadagnati} XP`);

    }

    setCollezione([...collezione, carta]);

    setXp(xp + xpGuadagnati);

  }

  function scannerFotocamera() {

    setMessaggio("Scanner fotocamera in arrivo!");

  }

  if (nomeAllenatore === "") {

    return (

      <div className="app">

        <div className="animated-bg"></div>

        <h1>PokeAscend</h1>

        <p className="sottotitolo">Scansiona. Colleziona. Ascendi.</p>

        <div className="glass-card">

          <h2>Crea il tuo profilo</h2>

          <p>Scegli il tuo nome allenatore.</p>

          <input

            value={nomeInserito}

            onChange={(e) => setNomeInserito(e.target.value)}

            placeholder="Nome allenatore"

          />

          <button onClick={registraAllenatore}>Inizia avventura</button>

        </div>

      </div>

    );

  }

  return (

    <div className="app">

      <div className="animated-bg"></div>

      <h1>PokeAscend</h1>

      <p className="sottotitolo">Scansiona. Colleziona. Ascendi.</p>

      {messaggio && <div className="messaggio">{messaggio}</div>}

      {schermata === "home" && (

        <>

          <div className="hero-card">

            <h2>Allenatore {nomeAllenatore}</h2>

            <p>Livello {livello}</p>

            <div className="xp-bar">

              <div style={{ width: `${xpNelLivello}%` }}></div>

            </div>

            <small>{xpNelLivello} / 100 XP</small>

          </div>

          <div className="missione">

            <h3>🎯 Missione del giorno</h3>

            <p>Scansiona 3 carte rare</p>

            <strong>Ricompensa: +150 XP</strong>

          </div>

          <div className="menu-grid">

            <button onClick={() => setSchermata("collezione")}>

              📚 <span>Collezione</span>

              <small>{collezione.length} carte</small>

            </button>

            <button onClick={() => setSchermata("cerca")}>

              🔎 <span>Cerca</span>

              <small>Trova carte</small>

            </button>

            <button onClick={() => setSchermata("tutte")}>

              🃏 <span>Tutte le carte</span>

              <small>Database</small>

            </button>

            <button onClick={() => setSchermata("profilo")}>

              👤 <span>Profilo</span>

              <small>Statistiche</small>

            </button>

          </div>

        </>

      )}

      {schermata === "cerca" && (

        <>

          <div className="glass-card">

            <h2>🔎 Ricerca rapida</h2>

            <input

              value={query}

              onChange={(e) => setQuery(e.target.value)}

              placeholder="Esempio: Charizard"

            />

            <button onClick={cercaCarta}>

              {loading ? "Ricerca..." : "Cerca Carta"}

            </button>

          </div>

          <div className="griglia-carte">

            {risultati.map((carta) => {

              const giaPresente = collezione.some((c) => c.id === carta.id);

              return (

                <div className="card-pokemon" key={carta.id}>

                  <img src={carta.images.small} alt={carta.name} />

                  <h3>{carta.name}</h3>

                  <p>{carta.rarity || "Rarità sconosciuta"}</p>

                  <button onClick={() => aggiungiCarta(carta)}>

                    {giaPresente ? "Duplicato +5 XP" : `Aggiungi +${calcolaXP(carta)} XP`}

                  </button>

                </div>

              );

            })}

          </div>

        </>

      )}

      {schermata === "scanner" && (

        <div className="glass-card scanner-big">

          <h2>📸 Scanner</h2>

          <p>Qui arriverà la scansione da fotocamera.</p>

          <button onClick={scannerFotocamera}>Apri fotocamera</button>

        </div>

      )}

      {schermata === "collezione" && (

        <>

          <h2>📚 La tua collezione</h2>

          {collezione.length === 0 ? (

            <p>Non hai ancora carte.</p>

          ) : (

            <div className="griglia-carte">

              {collezione.map((carta, index) => (

                <div className="card-pokemon" key={index}>

                  <img src={carta.images.small} alt={carta.name} />

                  <h3>{carta.name}</h3>

                  <p>{carta.rarity || "Rarità sconosciuta"}</p>

                </div>

              ))}

            </div>

          )}

        </>

      )}

      {schermata === "tutte" && (

        <div className="glass-card">

          <h2>🃏 Tutte le carte</h2>

          <p>Presto qui vedrai il database completo.</p>

          <button onClick={() => setSchermata("cerca")}>Cerca ora</button>

        </div>

      )}

      {schermata === "profilo" && (

        <div className="glass-card">

          <h2>👤 Profilo</h2>

          <p>Allenatore: {nomeAllenatore}</p>

          <p>Livello: {livello}</p>

          <p>XP totale: {xp}</p>

          <p>Carte totali: {collezione.length}</p>

          <p>Carte uniche: {new Set(collezione.map((c) => c.id)).size}</p>

        </div>

      )}

      <nav className="bottom-nav">

        <button onClick={() => setSchermata("home")}>🏠<span>Home</span></button>

        <button onClick={() => setSchermata("cerca")}>🔎<span>Cerca</span></button>

        <button onClick={() => setSchermata("scanner")}>📸<span>Scan</span></button>

        <button onClick={() => setSchermata("collezione")}>📚<span>Carte</span></button>

        <button onClick={() => setSchermata("profilo")}>👤<span>Profilo</span></button>

      </nav>

    </div>

  );

}

export default App;
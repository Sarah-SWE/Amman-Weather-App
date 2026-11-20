import { blue } from "@mui/material/colors";
import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

//Matirial UI Component:
import Container from "@mui/material/Container";
import { Button, Typography } from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import moment from "moment/moment";
import "moment/min/locales";
import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();
  console.log("hello");
  let cancelAxois = null;
  const [temp, setTemp] = useState({
    number: null,
    discription: "",
    min: null,
    max: null,
    icon: "",
    currentDate: null,
  });
  const [lang, setLang] = useState("en");

  // Handlers:
  function clickHandler() {
    if (lang === "ar") {
      setLang("en");
      moment.locale("ar");
    } else {
      setLang("ar");
      moment.locale("en");
    }
    i18n.changeLanguage(lang);
    setTemp({ ...temp, currentDate: moment().format("MMMM Do YYYY,    h:mm") });
  }

  useEffect(() => {
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=31.95&lon=35.94&appid=0049624781c63b7f4e369b122d443a76",
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxois = c;
          }),
        },
      )
      .then((response) => {
        const responseTempNumber = Math.round(response.data.main.temp - 272.15);
        const responseTempDisc = response.data.weather[0].description;
        const responseTempMax = Math.round(
          response.data.main.temp_max - 272.15,
        );
        const responseTempMin = Math.round(
          response.data.main.temp_min - 272.15,
        );
        const responseTempIcon = response.data.weather[0].icon;
        setTemp({
          ...temp,
          number: responseTempNumber,
          discription: responseTempDisc,
          max: responseTempMax,
          min: responseTempMin,
          icon: `https://openweathermap.org/img/wn/${responseTempIcon}@2x.png`,
        });
      })
      .catch((error) => {
        console.error(error);
      });
    return () => {
      console.log("hello from return");
      cancelAxois();
    };
  }, []);

  return (
    <div className="App" style={{ background: blue[400] }}>
      <Container maxWidth="sm">
        <div
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "end",
          }}
        >
          <div
            className="card"
            style={{ background: blue[600] }}
            dir={lang == "ar" ? "ltr" : "rtl"}
          >
            <div className="content">
              <div className="header">
                <Typography variant="h2" style={{ marginRight: 20 }}>
                  {t("Amman")}
                </Typography>
                <Typography variant="h6" style={{ marginRight: 20 }}>
                  {t(temp.currentDate)}
                </Typography>
              </div>
              <hr />
              <div className="body">
                <div
                  className="weather-info"
                  style={{
                    alignItems: "start",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h1" sx={{ marginLeft: 4 }}>
                      {temp.number}
                    </Typography>
                    <img src={temp.icon} alt="weatherIcon" />
                  </div>
                  <Typography variant="h6">{t(temp.discription)}</Typography>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h5>
                      {t("max")}: {temp.max}
                    </h5>
                    <h5 style={{ margin: "0 5px" }}>|</h5>
                    <h5>
                      {t("min")} : {temp.min}
                    </h5>
                  </div>
                </div>
                <div>
                  <CloudIcon sx={{ fontSize: 200 }} />
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="text"
            sx={{ marginTop: 2, borderRadius: 6, color: "white" }}
            onClick={clickHandler}
          >
            {lang === "ar" ? "عربي" : "انجليزي"}
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default App;


import { useEffect, useState } from "react";
import axios from "axios";
import { blue } from "@mui/material/colors";
import Container from "@mui/material/Container";
import { Button, Typography } from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import moment from "moment";
import "moment/min/locales";
import { useTranslation } from "react-i18next";
import "./App.css";

function App() {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState("ar");
  const [weather, setWeather] = useState({
    temp: null,
    description: "",
    min: null,
    max: null,
    icon: "",
  });
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const momentLocale = lang === "ar" ? "ar" : "en";
    moment.locale(momentLocale);
    setCurrentDate(moment().format("MMMM Do YYYY, h:mm A"));
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=31.95&lon=35.94&appid=0049624781c63b7f4e369b122d443a76",
        { signal: controller.signal },
      )
      .then((response) => {
        const data = response.data;
        const kelvinToCelsius = (k) => Math.round(k - 273.15);

        setWeather({
          temp: kelvinToCelsius(data.main.temp),
          description: data.weather[0].description,
          min: kelvinToCelsius(data.main.temp_min),
          max: kelvinToCelsius(data.main.temp_max),
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        });
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          console.error(error);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  function handleLanguageToggle() {
    setLang((prevLang) => (prevLang === "ar" ? "en" : "ar"));
  }

  const isArabic = lang === "ar";

  return (
    <div className="App" style={{ background: blue[400] }}>
      <Container maxWidth="sm">
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="card"
            style={{ background: blue[600] }}
            dir={isArabic ? "rtl" : "ltr"}
          >
            <div className="content">
              <div className="header">
                <Typography variant="h2" sx={{ mx: 2 }}>
                  {t("Amman")}
                </Typography>
                <Typography variant="h6" sx={{ mx: 2 }}>
                  {currentDate}
                </Typography>
              </div>
              <hr />
              <div className="body">
                <div className="weather-info">
                  <div className="temp-row">
                    <Typography variant="h1">
                      {weather.temp !== null ? `${weather.temp}°` : "--"}
                    </Typography>
                    {weather.icon && (
                      <img src={weather.icon} alt="weatherIcon" />
                    )}
                  </div>
                  <Typography variant="h6">{t(weather.description)}</Typography>
                  <div className="min-max-row">
                    <Typography variant="body1">
                      {t("max")}:{" "}
                      {weather.max !== null ? `${weather.max}°` : "--"}
                      <span> | </span>
                      {t("min")}:{" "}
                      {weather.min !== null ? `${weather.min}°` : "--"}
                    </Typography>
                  </div>
                </div>
                <div>
                  <CloudIcon sx={{ fontSize: 180 }} />
                </div>
              </div>
            </div>
          </div>

          <div className="lang-button-wrapper" style={{ marginTop: "50px" }}>
            <Button
              variant="text"
              sx={{ borderRadius: 6, color: "white" }}
              onClick={handleLanguageToggle}
            >
              {isArabic ? "Switch to English" : "التبديل إلى العربية"}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default App;

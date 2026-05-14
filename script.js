



// ================= Farm Analysis =================

function analyzeFarm() {

    const mode = document.getElementById("mode").value;
    const seasonInput = document.getElementById("season").value;
    const province = document.getElementById("province").value;
    const output = document.getElementById("output");

     // Check if province is selected
    if (!province) {
        output.innerHTML = "⚠️ Please select a province before continuing.";
        return;
    }
    const soil = window.selectedSoil || "";

    if (!soil) {
        output.innerHTML = "⚠️ Please select soil type.";
        return;
    }

    if (mode === "online") {
        getLiveWeather(soil);
    } else {

        if (!seasonInput) {
            output.innerHTML = "⚠️ Select season.";
            return;
        }

        processFarm(seasonInput, soil);
    }
}

// ================= Weather API =================

function getLiveWeather(soil) {

    const output = document.getElementById("output");

    output.innerHTML = "🌦️ Fetching rainfall data...";

    const url =
    `https://api.open-meteo.com/v1/forecast?latitude=-12.8&longitude=28.2&daily=precipitation_sum&timezone=auto`;

    fetch(url)
    .then(res => res.json())
    .then(data => {

        const rain = data.daily?.precipitation_sum?.[0] || 0;
        const season = rain > 0 ? "rainy" : "dry";

        processFarm(season, soil);

    })
    .catch(() => {
        output.innerHTML = " ⚠️ Weather fetch failed";
    });
}

// ================= Crop Recommendation =================

function processFarm(season, soil) {

    const output = document.getElementById("output");

    let crops = [];
    let reason = "";

   if (season === "rainy") 
    { switch (soil) 
        { case "loam": crops = ["Maize","Soybeans","Groundnuts","Cabbage","Tomatoes","Carrots","Onions"];
             reason = "Loam soil is fertile and well-drained."; 
             break;
              case "clay": crops = ["Rice","Sugarcane","Banana","Sweet Potato"]; 
              reason = "Clay retains water well.";
               break; 
              case "sandy": crops = ["Sorghum","Millet","Groundnuts","Watermelon"]; 
              reason = "Sandy soil drains quickly.";
               break;
               case "alluvial": crops = ["Rice","Sugarcane","Maize","Banana"]; 
               reason = "Alluvial soil is nutrient rich."; 
               break;
              case "sandy loam": crops = ["Maize","Groundnuts","Sorghum","Millet","Beans","Sweet Potato"];
               reason = "Sandy loam supports cereals and legumes.";
               break;
               case "clay loam": crops = ["Maize","Rice","Soybeans","Sunflower"];
                reason = "Clay loam is fertile and moisture retaining."; 
                break;
             } } else { 
                switch (soil) {
                     case "loam": crops = ["Sunflower","Sorghum","Groundnuts"]; 
                     reason = "Loam tolerates moderate drought."; 
                     break;
                      case "clay": crops = ["Cotton","Wheat","Maize"];
                       reason = "Clay retains moisture."; 
                      break; 
                      case "sandy": crops = ["Cassava","Millet","Sorghum","Groundnuts"];
                       reason = "Sandy soil suits drought resistant crops."; 
                      break;
                       case "alluvial": crops = ["Maize","Sorghum","Groundnuts"];
                        reason = "Alluvial soil keeps some moisture.";
                 break; 
                case "sandy loam": crops = ["Sorghum","Millet","Cassava","Groundnuts","Watermelon"];
                
                reason = "Sandy loam tolerates drought.";
                 break;
                 case "clay loam": crops = ["Wheat","Cotton","Maize","Sunflower"];
                  reason = "Clay loam supports irrigation farming.";
                  break; 
                } }

   const cropSpacing = { "Maize": "75cm between rows, 25cm between plants", 
    "Soybeans": "50cm between rows, 10cm between plants",
     "Groundnuts": "45cm between rows, 15cm between plants",
      "Cabbage": "60cm between rows, 45cm between plants", 
      "Tomatoes": "75cm between rows, 50cm between plants", 
      "Carrots": "30cm between rows, 5cm between plants", 
      "Onions": "30cm between rows, 10cm between plants", 
      "Rice": "20cm between rows, 15cm between plants", 
      "Sugarcane": "120cm between rows, 30cm between plants",
       "Banana": "250cm between plants",
        "Sweet Potato": "100cm between rows, 30cm between plants", 
        "Sorghum": "75cm between rows, 20cm between plants", 
        "Millet": "50cm between rows, 10cm between plants",
         "Watermelon": "200 cm between rows, 100cm between plants",
          "Wheat": "20cm between rows, 5cm between plants",
           "Spinach": "30cm between rows, 10cm between plants",
            "Irish Potato": "75cm between rows, 30cm between plants", 
            "Beets": "30cm between rows, 10cm between plants",
             "Cauliflower": "60cm between rows, 50cm between plants", 
             "Sunflower": "75cm between rows, 30cm between plants",
              "Cotton": "90cm between rows, 30cm between plants",
               "Peas": "50cm between rows, 10cm between plants",
                "Cassava": "100cm between rows, 100cm between plants" };

    output.innerHTML =
    `<h3>Recommended Crops</h3>
     <ul>
     ${crops.map(c =>
        `<li>${c} — Spacing: ${cropSpacing[c] || "N/A"}</li>`
     ).join("")}
     </ul>
     <strong>Why:</strong> <p>${reason}</p>

     <p><b>Season:</b> ${season}</p>`;
}

// ================= Province Soil Mapping =================

function updateSoils() {

    const province = document.getElementById("province").value;
    const soilField = document.getElementById("soil");

    const provinceSoilMap = {
        "Central":["loam","clay loam","sandy loam"],
        "Copperbelt":["clay","loam"],
        "Eastern":["sandy loam","loam","sandy"],
        "Luapula":["alluvial","clay"],
        "Lusaka":["loam","sandy loam", "clay loam"],
        "Muchinga":["loam","sandy loam", "sandy"],
        "Northern":["clay loam","alluvial"],
        "North-Western":["sandy loam","loam", "sandy"],
        "Southern":["sandy","loam", "clay loam"],
        "Western":["sandy","alluvial", "loam" ]
    };

    if (!provinceSoilMap[province]) {
        soilField.disabled = true;
        return;
    }

    soilField.disabled = false;

    const allowed = provinceSoilMap[province];

    Array.from(soilField.options).forEach(opt=>{
        if (!opt.value) return;
        opt.style.display =
        allowed.includes(opt.value) ? "block":"none";
    });

    soilField.value="";
    window.selectedSoil="";
}

// ================= Fertilizer Calculator =================

// ================= Fertilizer Data =================
const cropFertilizer = {
    "Maize": { npk: 250, urea: 90, spacing: "75 x 25" },
    "Rice": { npk: 200, urea: 75, spacing: "20 x 15" },
    "Soybeans": { npk: 75, urea: 15, spacing: "50 x 10" },
    "Groundnuts": { npk: 75, urea: 15, spacing: "45 x 15" },
    "Cabbage": { npk: 200, urea: 70, spacing: "60 x 45" },
    "Tomatoes": { npk: 200, urea: 40, spacing: "75 x 50" },
    "Carrots": { npk: 150, urea: 30, spacing: "30 x 5" },
    "Onions": { npk: 180, urea: 40, spacing: "30 x 10" },
    "Cassava": { npk: 60, urea: 25, spacing: "100 x 100" },
    "Wheat": { npk: 200, urea: 70, spacing: "20 x 5" },
    "Sunflower": { npk: 180, urea: 50, spacing: "75 x 30" },
    "Cotton": { npk: 200, urea: 60, spacing: "90 x 30" },
    "Peas": { npk: 75, urea: 15, spacing: "50 x 10" },
    "Watermelon": { npk: 125, urea: 60, spacing: "200 x 100" },
      "Sugarcane": { npk: 225, urea: 75, spacing: "60 x 25" },
        "Banana": { npk: 200, urea: 55, spacing: "250 x 250" },
};

// ================= Fertilizer Calculator =================
function calculateFertilizer() {

    const crop = document.getElementById("crop").value;
    const acres = parseFloat(document.getElementById("acres").value);
    const output = document.getElementById("fertilizerOutput");

    if (!crop || isNaN(acres) || acres <= 0) {
        output.innerHTML = "⚠️ Enter valid crop and acres.";
        return;
    }

    const rate = cropFertilizer[crop];

    if (!rate) {
        output.innerHTML = "⚠️ No data for selected crop.";
        return;
    }

    const [row, plant] = rate.spacing.split("x").map(v => parseFloat(v.trim()) / 100);

    const landArea = acres * 4046.86;

    const totalPlants = Math.floor(landArea / (row * plant));

    const totalNPK = rate.npk * acres;
    const totalUrea = rate.urea * acres;

    const npkPerPlant = ((totalNPK * 1000) / totalPlants).toFixed(2);
    const ureaPerPlant = ((totalUrea * 1000) / totalPlants).toFixed(2);

    output.innerHTML = `
        <h3>Results</h3>
        🌾 Crop: ${crop} <br>
       📏 Land: ${acres} acre(s) <br>
      🌱 Spacing: ${rate.spacing} cm <br><br>

        🌿Total Plants: ${totalPlants} <br><br>

        🧪 Total Fertilizer:<br>
        NPK: ${totalNPK} kg<br>
        Urea: ${totalUrea} kg<br><br>

        🌿 Per Plant:<br>
        NPK: ${npkPerPlant} g<br>
        Urea: ${ureaPerPlant} g
    `;
}

// ================= Expense Calculator =================
function calculateExpenses() {

    const seed = Number(document.getElementById("seed").value) || 0;
    const fertilizer = Number(document.getElementById("fertilizerCost").value) || 0;
    const labour = Number(document.getElementById("Labour").value) || 0;
    const machinery = Number(document.getElementById("machinery").value) || 0;
    const water = Number(document.getElementById("water").value) || 0;
    const misc = Number(document.getElementById("misc").value) || 0;
    const acres = Number(document.getElementById("acre").value) || 1;

    if (acres <= 0) {
        document.getElementById("expenseOutput").innerHTML = "⚠️ Invalid land size.";
        return;
    }

    const total = seed + fertilizer + labour + machinery + water + misc;
    const perAcre = total / acres;

    document.getElementById("expenseOutput").innerHTML = `
        <h3>Expense Summary</h3>
        Total Cost: ZMW ${total.toFixed(2)} <br>
        Cost per Acre: ZMW ${perAcre.toFixed(2)}
    `;
}
// ================= UI Controls =================

function openMenu(){
    document.getElementById("sideMenu").style.width="250px";
}

function closeMenu(){
    document.getElementById("sideMenu").style.width="0";
}

function showPage(pageId){

    document.querySelectorAll(".page").forEach(page=>{
        page.style.display="none";
        page.classList.remove("active");
    });

    const target=document.getElementById(pageId);

    if(target){
        target.style.display="block";
        target.classList.add("active");
    }
}


document.addEventListener("DOMContentLoaded", function () {

    const modeSelect = document.getElementById("mode");
    const seasonSelect = document.getElementById("season");

    function toggleSeasonField() {

        if (modeSelect.value === "online") {
            seasonSelect.disabled = true;
            seasonSelect.value = "";
            seasonSelect.style.opacity = "0.5";
        } 
        else {
            seasonSelect.disabled = false;
            seasonSelect.style.opacity = "1";
        }
    }

    // Run once when page loads
    toggleSeasonField();

    // Listen for mode changes
    modeSelect.addEventListener("change", toggleSeasonField);

});
const inputs = document.querySelectorAll(".numInput");

inputs.forEach(input => {
    input.addEventListener("input", function () {
        let value = this.value;

        // Remove anything that's not a number or dot
        value = value.replace(/[^0-9.]/g, '');

        // Split into parts
        let parts = value.split('.');

        // Keep only first decimal point
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
            parts = value.split('.');
        }

        // Limit to 2 decimal places
        if (parts[1]) {
            parts[1] = parts[1].slice(0, 2);
            value = parts[0] + '.' + parts[1];
        }

        // Prevent starting with "."
        if (value.startsWith(".")) {
            value = "0" + value;
        }

        this.value = value;
    });
});
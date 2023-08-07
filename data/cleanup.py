import pandas as pd

df = pd.read_csv("data/dst.csv", error_bad_lines=False)

print(df.columns)

# df = df.dropna(subset=["pl_masse", "sy_dist", "discoverymethod", "discoverydate"])
df = df[
    [
        "pl_name",
        "hostname",
        "sy_snum",
        "sy_pnum",
        "sy_mnum",
        "disc_facility",
        "discoverymethod",
        "disc_telescope", 
    	"disc_instrument",
        "disc_year",
        "pl_rade",
        "pl_masse",
        "pl_dens",
        "pl_eqt",
        "sy_dist",
        "st_spectype",
    ]
]

  
df = df.dropna(subset=df.columns.difference(['st_spectype']))

# Update "st_spectype" to contain only the first character
df['st_spectype'] = df['st_spectype'].str[0]


df["disc_year"] = pd.to_datetime(df["disc_year"], format="%Y")
df = df.rename(
    columns={
        "pl_name": "Planet Name",
        "hostname": "Host Star",
        "sy_snum" : "Number of Stars",
        "sy_pnum" : "Number of Planets",
        "sy_mnum" : "Number of Moons",
        "disc_facility": "Discovery Facility",
        "discoverymethod": "Discovery Method",
        "disc_telescope": "Discovery Telescope", 
    	"disc_instrument": "Discovery Instrument",
        "disc_year": "Discovery Year",
        "pl_rade": "Planet Radius [Earth radii]",
        "pl_masse": "Planet Mass [Earth mass]",
        "pl_dens": "Planet Density [g/cm^3]",
        "pl_eqt": "Equilibrium Temperature [K]",
        "sy_dist": "Distance from Earth [pc]",
        "st_spectype": "Spectral Type",
    }
)

df.to_csv("exoplanets_cleaned.csv", index=False)


# This file was produced by the NASA Exoplanet Archive  http://exoplanetarchive.ipac.caltech.edu
# COLUMN pl_name:        Planet Name
# COLUMN hostname:       Host Name
# COLUMN default_flag:   Default Parameter Set
# COLUMN sy_snum:        Number of Stars
# COLUMN sy_pnum:        Number of Planets
# COLUMN sy_mnum:        Number of Moons
# COLUMN discoverymethod: Discovery Method
# COLUMN disc_year:      Discovery Year
# COLUMN disc_facility:  Discovery Facility
# COLUMN disc_telescope: Discovery Telescope
# COLUMN disc_instrument: Discovery Instrument
# COLUMN soltype:        Solution Type
# COLUMN pl_controv_flag: Controversial Flag
# COLUMN pl_refname:     Planetary Parameter Reference
# COLUMN pl_orbper:      Orbital Period [days]
# COLUMN pl_rade:        Planet Radius [Earth Radius]
# COLUMN pl_masse:       Planet Mass [Earth Mass]
# COLUMN pl_dens:        Planet Density [g/cm**3]
# COLUMN pl_orbeccen:    Eccentricity
# COLUMN pl_insol:       Insolation Flux [Earth Flux]
# COLUMN pl_eqt:         Equilibrium Temperature [K]
# COLUMN st_refname:     Stellar Parameter Reference
# COLUMN st_spectype:    Spectral Type
# COLUMN st_mass:        Stellar Mass [Solar mass]
# COLUMN st_met:         Stellar Metallicity [dex]
# COLUMN st_metratio:    Stellar Metallicity Ratio
# COLUMN st_logg:        Stellar Surface Gravity [log10(cm/s**2)]
# COLUMN st_age:         Stellar Age [Gyr]
# COLUMN st_dens:        Stellar Density [g/cm**3]
# COLUMN sy_refname:     System Parameter Reference
# COLUMN sy_dist:        Distance [pc]
# COLUMN rowupdate:      Date of Last Update
# COLUMN pl_pubdate:     Planetary Parameter Reference Publication Date
# COLUMN releasedate:    Release Date

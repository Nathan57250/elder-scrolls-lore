#!/bin/bash
# Download images from UESP Wiki (CC-BY-SA 2.5) for use in the Elder Scrolls Lore site.
# Attribution: All images sourced from UESP (https://en.uesp.net) under CC-BY-SA 2.5.
# Run this script from the project root.

BASE="static/images"

echo "Downloading images from UESP (CC-BY-SA 2.5)..."

# Dawn Era
curl -sL "https://images.uesp.net/thumb/3/39/Lore-race-Aedra.png/600px-Lore-race-Aedra.png" -o "$BASE/dawn-era/aedra.png"
curl -sL "https://images.uesp.net/thumb/f/f5/ON-concept-Daedric_Princes.jpg/800px-ON-concept-Daedric_Princes.jpg" -o "$BASE/dawn-era/daedric-princes.jpg"
curl -sL "https://images.uesp.net/thumb/9/95/LO-map-Aurbis_2.png/800px-LO-map-Aurbis_2.png" -o "$BASE/dawn-era/aurbis-map.png"
curl -sL "https://images.uesp.net/thumb/d/df/OB-place-White_Gold_Tower.jpg/800px-OB-place-White_Gold_Tower.jpg" -o "$BASE/dawn-era/white-gold-tower.jpg"
curl -sL "https://images.uesp.net/thumb/8/83/SR-quest-Sovngarde_3.jpg/800px-SR-quest-Sovngarde_3.jpg" -o "$BASE/dawn-era/sovngarde.jpg"

# Merethic Era
curl -sL "https://images.uesp.net/thumb/4/4d/SR-npc-Paarthurnax.jpg/800px-SR-npc-Paarthurnax.jpg" -o "$BASE/merethic-era/paarthurnax.jpg"
curl -sL "https://images.uesp.net/thumb/2/28/LO-race-Snow_Elf.png/600px-LO-race-Snow_Elf.png" -o "$BASE/merethic-era/snow-elf.png"
curl -sL "https://images.uesp.net/thumb/9/9d/SR-place-Ysgramor%27s_Tomb.jpg/800px-SR-place-Ysgramor%27s_Tomb.jpg" -o "$BASE/merethic-era/ysgramor-tomb.jpg"
curl -sL "https://images.uesp.net/thumb/b/b4/DB-creature-Miraak.jpg/800px-DB-creature-Miraak.jpg" -o "$BASE/merethic-era/miraak.jpg"

# First Era
curl -sL "https://images.uesp.net/thumb/a/a1/MW-place-Red_Mountain.jpg/800px-MW-place-Red_Mountain.jpg" -o "$BASE/first-era/red-mountain.jpg"
curl -sL "https://images.uesp.net/thumb/8/87/MW-creature-Vivec.jpg/600px-MW-creature-Vivec.jpg" -o "$BASE/first-era/vivec.jpg"
curl -sL "https://images.uesp.net/thumb/4/48/LO-map-Cyrodiil_%28Oblivion%29.jpg/800px-LO-map-Cyrodiil_%28Oblivion%29.jpg" -o "$BASE/first-era/cyrodiil-map.jpg"
curl -sL "https://images.uesp.net/thumb/e/e5/MW-item-Keening.png/200px-MW-item-Keening.png" -o "$BASE/first-era/keening.png"
curl -sL "https://images.uesp.net/thumb/0/02/LO-misc-Numidium.png/400px-LO-misc-Numidium.png" -o "$BASE/first-era/numidium.png"

# Second Era
curl -sL "https://images.uesp.net/thumb/d/d4/ON-npc-Mannimarco_%28God_of_Worms%29.jpg/600px-ON-npc-Mannimarco_%28God_of_Worms%29.jpg" -o "$BASE/second-era/mannimarco.jpg"
curl -sL "https://images.uesp.net/thumb/3/3e/LO-race-Tsaesci.png/600px-LO-race-Tsaesci.png" -o "$BASE/second-era/tsaesci.png"
curl -sL "https://images.uesp.net/thumb/8/81/ON-concept-Three_Banners_War.jpg/800px-ON-concept-Three_Banners_War.jpg" -o "$BASE/second-era/three-alliances.jpg"

# Third Era
curl -sL "https://images.uesp.net/thumb/a/a7/OB-quest-Light_the_Dragonfires.jpg/800px-OB-quest-Light_the_Dragonfires.jpg" -o "$BASE/third-era/oblivion-crisis.jpg"
curl -sL "https://images.uesp.net/thumb/b/be/MW-place-Vvardenfell.jpg/800px-MW-place-Vvardenfell.jpg" -o "$BASE/third-era/vvardenfell.jpg"
curl -sL "https://images.uesp.net/thumb/0/0e/OB-npc-Martin_Septim.jpg/400px-OB-npc-Martin_Septim.jpg" -o "$BASE/third-era/martin-septim.jpg"
curl -sL "https://images.uesp.net/thumb/c/c0/MW-npc-Dagoth_Ur.jpg/600px-MW-npc-Dagoth_Ur.jpg" -o "$BASE/third-era/dagoth-ur.jpg"

# Fourth Era
curl -sL "https://images.uesp.net/thumb/3/3e/SR-creature-Alduin.jpg/800px-SR-creature-Alduin.jpg" -o "$BASE/fourth-era/alduin.jpg"
curl -sL "https://images.uesp.net/thumb/a/a4/SR-npc-Ulfric_Stormcloak.jpg/400px-SR-npc-Ulfric_Stormcloak.jpg" -o "$BASE/fourth-era/ulfric.jpg"
curl -sL "https://images.uesp.net/thumb/c/cd/SR-place-Whiterun.jpg/800px-SR-place-Whiterun.jpg" -o "$BASE/fourth-era/whiterun.jpg"
curl -sL "https://images.uesp.net/thumb/7/7b/SR-place-Solitude.jpg/800px-SR-place-Solitude.jpg" -o "$BASE/fourth-era/solitude.jpg"
curl -sL "https://images.uesp.net/thumb/8/8d/SR-place-College_of_Winterhold.jpg/800px-SR-place-College_of_Winterhold.jpg" -o "$BASE/fourth-era/college-winterhold.jpg"
curl -sL "https://images.uesp.net/thumb/0/04/SR-place-High_Hrothgar.jpg/800px-SR-place-High_Hrothgar.jpg" -o "$BASE/fourth-era/high-hrothgar.jpg"
curl -sL "https://images.uesp.net/thumb/5/5f/LO-map-Skyrim_%28Labeled%29.png/800px-LO-map-Skyrim_%28Labeled%29.png" -o "$BASE/fourth-era/skyrim-map.png"

# Common
curl -sL "https://images.uesp.net/thumb/9/96/LO-map-Tamriel_%28Anthology%29.jpg/1000px-LO-map-Tamriel_%28Anthology%29.jpg" -o "$BASE/common/tamriel-map.jpg"

echo "Done! All images sourced from UESP under CC-BY-SA 2.5."
echo "Attribution must be included: https://en.uesp.net - Licensed under CC-BY-SA 2.5"

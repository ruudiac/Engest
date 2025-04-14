Arendusprotsessi kirjeldus:

Rakenduse arendamisel olid mõned osad kergemad ja mõned tunduvalt keerulisemad.

Kergemad osad:

UI loomine SwiftUI-s osutus võrdlemisi lihtsaks ja loogiliseks. Näiteks pildi kuvamine, nupud ja taustavärvi määramine olid intuitiivsed.
Pildi valimine galeriist või kaamera kasutamine kujunes samuti sujuvaks, kui sain aru, kuidas UIImagePickerController töötab UIViewControllerRepresentable kaudu.
Raskemad osad:

Mikrofoni ja kaamera lubade küsimine oli keeruline, sest alguses unustasin need Info.plist faili lisada (NSCameraUsageDescription ja NSMicrophoneUsageDescription). Selle tõttu rakendus crashis ja mul läks aega, enne kui mõistsin, miks.
Audio salvestamise ja esitusloogika loomine oli tehniliselt keeruline. AVFoundation API on võimas, kuid vajab palju käsitsi seadistamist (nt audio sessiooni seadistamine, salvestamise seaded, loa küsimine).
Waveformi visualiseerimine ehk helitasemete dünaamiline näitamine oli keeruline, sest pidin normaliseerima averagePower väärtused ja kirjutama loogika, mis graafiliselt reageeriks salvestamise ajal.
Probleemid ja crashid:

Esialgu rakendus kukkus kokku, kui proovisin avada kaamerat või salvestada heli ilma vastavaid õigusi küsimata.
Mikrofoni ja kaamera õiguste puudumine tekitas frustratsiooni, sest isegi kui loogika oli õige, ei töötanud funktsionaalsus enne, kui õigused olid korrektselt küsitud ja antud.
Lisaks oli koodi keerukus suur – pidin hallama mitut @State muutujat ja jälgima mitmeid asünkroonseid protsesse (nt loaloendid, taimer audio tasemete jaoks jne).

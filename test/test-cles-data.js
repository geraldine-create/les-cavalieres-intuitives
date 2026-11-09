/* =========================================================
   Test « Quelle cavalière ton cheval voit-il en toi ? »
   Données et calcul du profil — FICHIER PARTAGÉ
   Le même fichier est utilisé par :
   - le site  : /test/test-cles-data.js
   - l'appli Découverte : netlify/functions/test-cles/data.js
   Si tu modifies un texte, copie le fichier aux deux endroits.
   ========================================================= */
(function(){

/* ---------- Réglages communs ---------- */
const CONFIG = {
  // Lien de la vidéo (YouTube non répertoriée, par ex.). Laisser vide tant qu'elle n'est pas prête.
  videoUrl: "",
  videoTitre: "Pourquoi ta peur arrive maintenant, et pas quand tu étais débutante",
  // Page du test (sert aussi au lien « réserver un appel » dans l'e-mail)
  pageTest: "https://les-cavalieres-intuitives.com/test/"
};

/* ---------- Questions (ordre alterné) ---------- */
const QUESTIONS = [
  ["Avant de demander quelque chose à mon cheval, je me demande si j'ai vraiment le droit de lui imposer ça.","I",0],
  ["Quand mon cheval lève la tête ou s'arrête, j'imagine déjà ce qui pourrait arriver ensuite.","T",0],
  ["Quand je sens mon cheval tendu, je retiens ma respiration.","E",0],
  ["J'évite certaines situations (balade, carrière vide, nouvel exercice) par peur de ce qui pourrait se passer.","P",0],
  ["Quand mon cheval ne répond pas comme prévu, ma première pensée est « c'est ma faute ».","I",0],
  ["Je repère les « dangers » (bâche, bruit, autre cheval) avant même que mon cheval les remarque.","T",0],
  ["Mes mains ou mes jambes se crispent sans que je le décide.","E",0],
  ["Quand mon cheval hésite, je me sens capable de lui montrer le chemin.","P",1],
  ["Je change d'objectif en cours de séance dès que je sens une résistance.","I",0],
  ["Je réalise après coup que j'ai réagi trop tard ou trop tôt.","T",0],
  ["Mon cœur s'accélère à l'approche de certaines situations (sortie, nouvel endroit, jour de vent).","E",0],
  ["Je préfère que quelqu'un d'autre gère mon cheval quand il est agité.","P",0],
  ["J'ai peur qu'une demande trop ferme abîme notre relation.","I",0],
  ["Pendant la séance, je repense à des moments difficiles vécus avec lui.","T",0],
  ["Je sens que mon stress passe dans mon cheval.","E",0],
  ["J'arrête la séance ou je descends plus tôt que prévu quand je doute.","P",0],
  ["Je sais précisément ce que je veux construire avec mon cheval avant de commencer la séance.","I",1],
  ["J'arrive à rester attentive à ce que mon cheval me propose, là, maintenant.","T",1],
  ["Je sais comment faire redescendre mon énergie quand je sens qu'elle monte.","E",1],
  ["J'ai le sentiment que c'est mon cheval qui décide plus que moi.","P",0],
  ["Je pense que d'autres cavalières s'en sortiraient mieux que moi avec mon cheval.","I",0],
  ["Mes pensées m'empêchent de sentir le bon moment pour relâcher ou pour demander.","T",0],
  ["Après une séance tendue, je reste chargée émotionnellement pendant des heures.","E",0],
  ["Je me sens légitime pour poser un cadre clair à mon cheval, même avec douceur.","P",1]
];
const ECHELLE = ["Jamais","Rarement","Parfois","Souvent","Presque toujours"];
const CLES = {I:"Intention",T:"Timing",E:"Énergie",P:"Posture"};
const DEFINITIONS = {
  I:"La clarté de ce que tu demandes à ton cheval.",
  T:"Ta présence à l'instant, au bon moment.",
  E:"Ce que ton corps transmet à ton cheval.",
  P:"Ta place de guide auprès de lui."
};
const ZONES = {appui:"Ton point d'appui", fragile:"Fragile selon les situations", peur:"Là où la peur prend le dessus"};
const TEXTES = {
 I:{
  peur:{vis:"Tu te demandes si tu as le droit de lui imposer quelque chose. Tu commences une demande, puis tu la lâches au premier signe de résistance. Tu changes d'exercice en cours de route, et quand il ne répond pas, ta première pensée est « c'est ma faute ».",
        cheval:"Le cheval apprend par association : un signal, puis ce qui le suit. Quand ta demande s'arrête au moment où il résiste, il apprend que résister fait cesser la demande. Des signaux qui changent ou s'interrompent rendent son environnement imprévisible, et pour un animal de proie, l'imprévisibilité est une source de stress. Il cherche alors ses repères ailleurs : dans son environnement, auprès des autres chevaux, ou dans ses propres choix."},
  fragile:{vis:"Tes demandes sont claires dans les situations que tu connais bien. Mais dès que quelque chose se complique, le doute revient et ta demande devient hésitante.",
        cheval:"La plupart du temps, il reçoit des signaux cohérents, ce qui construit sa confiance. Mais l'hésitation apparaît justement dans les moments sensibles, quand il aurait le plus besoin d'un repère stable."},
  appui:{vis:"Tu sais ce que tu veux construire avec ton cheval et tu tiens ton cap, avec douceur.",
        cheval:"Tes signaux sont stables et prévisibles : il peut anticiper ce qui va suivre. La prévisibilité est l'un des facteurs qui apaisent le plus un cheval."}
 },
 T:{
  peur:{vis:"Tu scrutes l'environnement : tu repères la bâche, le bruit ou le tracteur avant lui. Pendant la séance, tu repenses à la dernière frayeur ou tu imagines la prochaine. Après coup, tu te dis souvent que tu as réagi trop tôt ou trop tard.",
        cheval:"Dans un troupeau, quand un cheval lève la tête, se fige et fixe un point, les autres passent en alerte : c'est un mécanisme de survie. Ton regard qui se fixe et ton corps qui se prépare sont lus de la même façon, comme le signal d'un congénère qui a repéré un danger. Ton cheval ne peut pas savoir que tu anticipes « au cas où » : pour lui, il y a quelque chose à surveiller, et il se met lui aussi en vigilance. Et quand ton attention est ailleurs, tes relâchers arrivent en décalé. Or le cheval apprend au moment précis où la pression s'arrête : un relâcher en retard récompense une autre réponse que celle que tu cherchais."},
  fragile:{vis:"Tu es présente quand tout va bien. Mais au premier signe inhabituel, ton esprit part en avant et tu commences à surveiller.",
        cheval:"Il perçoit la bascule : ton attention qui quitte votre échange pour se tourner vers l'environnement. Pour lui, c'est un signal qu'il faut surveiller, au moment même où il cherchait un repère."},
  appui:{vis:"Tu restes dans l'instant, à l'écoute de ce que ton cheval te propose.",
        cheval:"Tes réponses arrivent au bon moment, donc il comprend vite ce que tu attends. Et un congénère calme, qui ne réagit pas à un bruit ou à un objet, indique au cheval que l'environnement est sûr."}
 },
 E:{
  peur:{vis:"Ton souffle se bloque, tes mains se ferment, ton bassin se fige, souvent sans que tu t'en rendes compte. Ton cœur s'accélère dans certaines situations, et la tension reste longtemps après la séance.",
        cheval:"Le cheval perçoit des variations très fines de pression et de tonus, à travers la selle, tes jambes et les rênes. Une respiration bloquée, une main qui se ferme, un bassin qui se raidit ressemblent pour lui aux signaux d'un corps qui se prépare à fuir. Les études montrent que la tension d'une personne peut faire monter la fréquence cardiaque du cheval. Il ne devine pas ton stress : il réagit à des signaux physiques bien réels, qui annoncent un danger pour un animal de proie."},
  fragile:{vis:"Tu sais te détendre quand tout va bien, mais ton corps se crispe dans les situations qui t'impressionnent.",
        cheval:"La plupart du temps, il sent un corps disponible. Puis, dans les moments sensibles, ton tonus change d'un coup. Ce changement brusque est en lui-même un signal d'alerte pour lui."},
  appui:{vis:"Tu sens quand ton énergie monte, et tu sais la faire redescendre.",
        cheval:"Un corps qui se relâche et une respiration ample sont des signaux de sécurité. Ton calme physique devient un repère sur lequel il peut se régler."}
 },
 P:{
  peur:{vis:"Tu évites certaines situations, comme la balade, la carrière vide ou un nouvel exercice. Quand il s'agite, tu préfères que quelqu'un d'autre s'en occupe, et quand tu doutes, tu arrêtes la séance. Tu as l'impression que c'est lui qui décide.",
        cheval:"Chez le cheval, la confiance ne repose pas sur la domination mais sur la sécurité et la prévisibilité : il suit plus volontiers un individu calme et constant. Quand personne ne tient ce rôle, il doit gérer seul. Il prend alors les décisions (s'arrêter, faire demi-tour, partir) selon ses propres critères d'animal de proie, qui privilégient la fuite. Et chaque arrêt au moment où il s'inquiète lui apprend que s'inquiéter met fin au travail."},
  fragile:{vis:"Tu prends ta place dans les situations que tu connais. Mais quand ça se complique, tu te mets en retrait.",
        cheval:"Il a un repère fiable… qui disparaît dans les situations nouvelles, justement celles où il en a le plus besoin."},
  appui:{vis:"Quand ton cheval hésite, tu te sens capable de lui montrer le chemin, avec un cadre clair et doux.",
        cheval:"Il peut s'appuyer sur toi plutôt que sur sa propre vigilance. C'est exactement ce qu'il cherche : un référent de confiance."}
 }
};
const PRIORITE = ["E","T","I","P"]; // en cas d'égalité : le cheval perçoit d'abord le corps

/* ---------- Profils ---------- */
const PROFILS = {
  I:{nom:"La Bienveillante qui doute",
     voit:"Tu aimes profondément ton cheval et tu as peur de mal faire. Ce doute rend tes demandes hésitantes ou changeantes, et ton cheval perd ses repères.",
     robert:"« Si tu demandes, tu vas le brusquer. »",
     outilTitre:"Ton outil : la phrase-boussole",
     outil:"Avant de monter, formule ton intention en une phrase positive (« Aujourd'hui, on cherche la détente au trot »). Quand le doute arrive, note la pensée, cherche une preuve qu'elle est vraie, puis une pensée plus juste.",
     invitation:"Une intention claire n'est pas une contrainte : pour ton cheval, c'est un repère rassurant. C'est exactement ce qu'on construit ensemble dans Mission Connexion, sans renoncer à ta douceur."},
  T:{nom:"La Sentinelle",
     voit:"Ton attention part vers ce qui pourrait arriver. Ton cheval lit cette vigilance comme un signal d'alerte et se met, lui aussi, à surveiller.",
     robert:"« Attention, là-bas, il va y avoir un problème. »",
     outilTitre:"Ton outil : l'ancrage 3 sensations",
     outil:"Quand ton esprit part en avant, nomme trois choses que tu sens maintenant : le contact des rênes, le mouvement de son dos, ton poids dans la selle. Puis dis-toi : « Je remarque que je pense qu'il va… ».",
     invitation:"Le bon timing n'existe que dans le maintenant. Les analyses vidéo de Mission Connexion t'aident à repérer tes moments justes et à les retrouver."},
  E:{nom:"L'Éponge",
     voit:"Ton corps se crispe avant même que tu y penses. Ton cheval perçoit cette tension et la traduit comme l'annonce d'un danger.",
     robert:"« Retiens ton souffle, ça va passer. »",
     outilTitre:"Ton outil : l'expiration longue",
     outil:"Inspire sur 4 temps, expire sur 6. À chaque expiration, relâche une zone : la mâchoire, puis les mains, puis le bassin. Ton corps est le levier le plus rapide pour apaiser ton cheval.",
     invitation:"La contagion émotionnelle va dans les deux sens. Dans Mission Connexion, tu apprends à devenir le point calme de ton cheval, au lieu de capter ses tempêtes."},
  P:{nom:"La Protectrice en retrait",
     voit:"Tu te mets en retrait quand les choses se compliquent. Sans repère stable, ton cheval prend seul les décisions, avec ses réflexes d'animal de proie.",
     robert:"« Pas aujourd'hui. On verra quand il sera plus calme. »",
     outilTitre:"Ton outil : l'échelle des 10 marches",
     outil:"Écris 10 situations, de la plus facile à la plus difficile. Monte d'une marche seulement quand la précédente est devenue confortable, et note chaque réussite.",
     invitation:"Chaque évitement soulage sur le moment, mais nourrit la peur. Mission Connexion t'accompagne marche après marche pour reprendre ta place, sans te mettre en danger."},
  EVEIL:{nom:"La Référente en éveil",
     voit:"Tes quatre clés sont des points d'appui. Ton cheval trouve en toi un repère calme et prévisible.",
     robert:"",
     outilTitre:"Ton outil : le journal de connexion",
     outil:"Après chaque séance, note un moment où vous étiez vraiment ensemble, et ce que tu as fait juste avant. Ton intuition s'entraîne comme un muscle.",
     invitation:"Tu as déjà fait un vrai chemin. Ce qui te manque n'est pas la confiance, c'est la finesse : sentir plus tôt, demander plus léger. Le Collectif te permet de continuer à progresser avec d'autres cavalières qui partagent ta vision."},
  CHEMIN:{nom:"La Cavalière en chemin",
     voit:"Tu as déjà de vrais points d'appui, et aucune de tes clés n'est prise par la peur. Certaines situations te font encore vaciller, et c'est dans ces moments-là que ton cheval perd un peu son repère.",
     robert:"« Et si, cette fois, ça se passait mal ? »",
     outilTitre:"", outil:"",
     invitation:"Tu n'as pas besoin de tout reconstruire : il s'agit d'ajuster les moments où tu vacilles. Le Collectif t'offre un cadre régulier, des analyses vidéo et d'autres cavalières qui avancent avec toi."},
  TENSION:{nom:"La Cavalière sous tension",
     voit:"Plusieurs clés sont prises par la peur en même temps. Ton cheval reçoit beaucoup de signaux d'alerte, et toi, tu portes une charge très lourde.",
     robert:"« Tu n'y arriveras jamais. »",
     outilTitre:"Ton outil : l'expiration longue, pied à terre",
     outil:"À côté de ton cheval, inspire sur 4 temps, expire sur 6. À chaque expiration, relâche la mâchoire, puis les mains. On commence par le corps : c'est ce que ton cheval perçoit en premier.",
     invitation:"« Je l'aime tellement que j'ai peur de tout gâcher. » Si cette phrase te serre le cœur, tu n'es pas seule. Un accompagnement individuel est le format le plus adapté pour toi : parlons-en lors d'un appel découverte."}
};

/* ---------- Histoire et concept (e-mail complet) ---------- */
const HISTOIRES = {
  I:{histoire:"Tu arrives à l'écurie avec un vrai projet. Au premier signe de résistance, tu renonces, par respect pour lui. Ça te semble gentil de ne pas insister. Mais pour ton cheval, une demande qui s'arrête au moment où il résiste est une demande qui a obtenu sa réponse.",
     concept:"En TCC, on appelle « pensées automatiques » ces phrases qui surgissent sans qu'on les choisisse : « je n'ai pas le droit », « c'est ma faute ». Ce sont elles qui décident d'arrêter ta demande. Une intention claire n'est pas une contrainte : pour ton cheval, c'est un repère qui rassure."},
  T:{histoire:"Tu as repéré la bâche avant lui. Tu t'es préparée, ton corps aussi. C'est à ce moment-là qu'il l'a vue… en suivant ton regard.",
     concept:"L'anticipation déplace ton attention vers ce qui pourrait arriver. Et ton cerveau retient surtout les fois où tu avais « raison » : c'est le biais de confirmation. Or le bon timing, relâcher ou demander au bon moment, n'existe que dans l'instant présent."},
  E:{histoire:"Il se tend, tu te tends. Tu te tends, il se tend encore plus. Tu sors de la séance vidée, et tu y penses encore le soir.",
     concept:"Ton corps réagit avant ta pensée : c'est le système d'alerte de ton cerveau, qui se déclenche en une fraction de seconde. Ton cheval perçoit cette tension par la selle, tes jambes et les rênes. La bonne nouvelle : ton corps est aussi le levier le plus rapide pour casser la boucle."},
  P:{histoire:"Pas de balade depuis des mois. La carrière, seulement quand elle est vide. Chaque renoncement soulage sur le moment… et le cercle de ce qui reste possible se rétrécit.",
     concept:"En TCC, l'évitement est ce qui entretient la peur : il empêche de vivre l'expérience qui la contredirait. Le sentiment d'être capable se construit par petites réussites vécues, une marche après l'autre."},
  EVEIL:{histoire:"Tu as déjà fait un vrai chemin. Ce qui te manque n'est pas la confiance, c'est la finesse : sentir plus tôt, demander plus léger.",
     concept:"Quand la peur ne décide plus à ta place, l'intuition peut prendre la sienne. Elle s'entraîne, comme un muscle."},
  CHEMIN:{histoire:"La plupart du temps, ça va. Et puis il y a ces moments, un nouveau lieu, un jour de vent, une réaction inattendue, où tu sens que tu vacilles.",
     concept:"Tes clés ne sont pas bloquées : elles sont fragiles selon les situations. C'est justement dans ces moments-là que ton cheval cherche le plus un repère. Renforcer ta clé la plus fragile suffit souvent à rendre tout l'ensemble plus stable."},
  TENSION:{histoire:"« Je l'aime tellement que j'ai peur de tout gâcher. » Si cette phrase te serre le cœur, tu n'es pas seule. Beaucoup de cavalières que j'accompagne sont arrivées exactement là.",
     concept:"Quand plusieurs clés sont prises par la peur, la boucle tourne en entier : le corps, la pensée, l'attention, le comportement. On ne la défait pas en luttant contre elle, mais en commençant par le corps, ce que ton cheval perçoit en premier."}
};

/* ---------- Calcul du profil ---------- */
function zoneDe(v){ return v<=13 ? "appui" : (v<=21 ? "fragile" : "peur"); }

function calculerProfil(reponses){
  if(!Array.isArray(reponses) || reponses.length!==QUESTIONS.length) throw new Error("reponses invalides");
  const s = {I:0,T:0,E:0,P:0};
  QUESTIONS.forEach((q,i)=>{
    const v = Number(reponses[i]);
    if(!(v>=1 && v<=5)) throw new Error("reponse hors echelle");
    s[q[1]] += q[2] ? 6-v : v;
  });
  const vals = Object.values(s);
  const peur = vals.filter(v=>v>=22).length;
  const appui = vals.filter(v=>v<=13).length;
  const max = Math.max(...vals), min = Math.min(...vals);
  const prioritaire = PRIORITE.find(k=>s[k]===max);
  const ressource = ["P","I","T","E"].find(k=>s[k]===min);
  let code;
  if(peur>=3) code="TENSION";
  else if(appui===4) code="EVEIL";
  else if(peur===0) code="CHEMIN";
  else code=prioritaire;
  const ordre = ["I","T","E","P"].slice().sort((a,b)=>s[b]-s[a]);
  return {scores:s, code, prioritaire, ressource, ordre};
}

/* Outil affiché (pour « en chemin », celui de la clé prioritaire) */
function outilDe(r){
  if(r.code==="CHEMIN"){
    const q = PROFILS[r.prioritaire];
    return {titre:q.outilTitre, texte:"Ta clé à renforcer en priorité est la clé "+CLES[r.prioritaire]+". "+q.outil};
  }
  return {titre:PROFILS[r.code].outilTitre, texte:PROFILS[r.code].outil};
}

const API = {CONFIG,QUESTIONS,ECHELLE,CLES,DEFINITIONS,ZONES,TEXTES,PRIORITE,PROFILS,HISTOIRES,zoneDe,calculerProfil,outilDe};
if(typeof module!=="undefined" && module.exports) module.exports = API;
else window.TestCles = API;
})();

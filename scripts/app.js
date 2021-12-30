// Récupération du body
const body = document.body;

// Création du container global
const container = document.createElement('div');
container.setAttribute('class', 'container');
body.appendChild(container);

// Création de la zone du score
const score = document.createElement('div');
score.setAttribute('class', 'score');
container.appendChild(score);

const scoreTitre = document.createElement('span');
scoreTitre.setAttribute('class', 'scoreTitre');
scoreTitre.innerHTML = 'Score : ';
score.appendChild(scoreTitre);

const scoreResultat = document.createElement('span');
scoreResultat.setAttribute('class', 'scoreResultat');
score.appendChild(scoreResultat);

// Création de la zone de jeu
const gameZone = document.createElement('div');
gameZone.setAttribute('class', 'gameZone');
container.appendChild(gameZone);

// Variables du jeu
let toutesLesCases = [];
let tousLesAliens = [];
let vaisseauPosition = 369;
let descendreDroite = true;
let descendreGauche = true;
let direction = 1;
let width = 20;
let resultat = 0;
scoreResultat.innerHTML = resultat;

// Vitesse de descente des aliens
let aliensId = setInterval(deplaceEnnemis, 500);

// Démarrage du du jeu
game();

// Construction du jeu
function game()
{
    invasionAliens();
    aliens();
    vaisseau();
    document.addEventListener('keydown', deplacerVaisseau);
    deplaceEnnemis();
    document.addEventListener('keyup', tirLaser);
}

// Fonction de création des cases de la grille
function invasionAliens()
{
    let index = 0;

    for(let c = 0 ; c < 400 ; c++)
    {
        if(index === 0)
        {
            // Si l'index est à 0, colonne 1 (colonne extrémité gauche)
            const cases = document.createElement('div');
            cases.setAttribute('class', 'case');
            cases.setAttribute('data-left', 'true');
            gameZone.append(cases);
            toutesLesCases.push(cases);
            index++;
        }
        else if(index === 19)
        {
            // Si l'index est à 19, colonne 20 (colonne extrémité droite)
            const cases = document.createElement('div');
            cases.setAttribute('class', 'case');
            cases.setAttribute('data-right', 'true');
            gameZone.append(cases);
            toutesLesCases.push(cases);
            index = 0;
        }
        else
        {
            // Colonnes entre les extrémités, colonnes 2 à 19
            const cases = document.createElement('div');
            cases.setAttribute('class', 'case');
            gameZone.append(cases);
            toutesLesCases.push(cases);
            index++;
        }
    }
}

// Fonction de Positionnement des aliens
function aliens()
{
    for(let a = 1 ; a < 93 ; a++)
    {
        if(a === 13)
        {
            // Positionnement 13 à 24
            a = 41;
            tousLesAliens.push(a);
        }
        else if(a === 53)
        {
            // Positionnement 25 à 36
            a = 81;
            tousLesAliens.push(a);
        }
        else
        {
            // Positionnement 1 à 12
            tousLesAliens.push(a);
        }

        // Affichage des aliens dans leurs cases de départ
        tousLesAliens.forEach(alien =>    
        {
            toutesLesCases[alien].classList.add('alien');
        });
    }
}

// Fonction de positionnement du vaisseau
function vaisseau()
{
    toutesLesCases[vaisseauPosition].classList.add('vaisseau');
}

// Fonction de déplacement du vaisseau
function deplacerVaisseau(e)
{
    // Effacement du vaisseau
    toutesLesCases[vaisseauPosition].classList.remove('vaisseau');

    // Si on appuie sur la flèche Gauche
    if(e.keyCode === 37)
    {
        if(vaisseauPosition > 360)
        {
            vaisseauPosition -= 1;
        }
    }
    
    // Si on appuie sur la flèche Droite
    if(e.keyCode === 39)
    {
        if(vaisseauPosition < 379)
        {
            vaisseauPosition += 1;
        }
    }

    // Apparition du vaisseau
    toutesLesCases[vaisseauPosition].classList.add('vaisseau');
}

// Fonction de déplacement des ennemis
function deplaceEnnemis()
{
    // Gestion de la descente des aliens
    for(let i = 0 ; i < tousLesAliens.length ; i++)
    {
        if(toutesLesCases[tousLesAliens[i]].getAttribute('data-right') === 'true')
        {
            // Si les aliens sout complètement à droite
            if(descendreDroite)
            {
                direction = 20;
                setTimeout(() =>
                {
                    descendreDroite = false;
                }, 50);
            }
            else if(descendreDroite === false)
            {
                direction = -1;
            }
            descendreGauche = true;
        }
        else if(toutesLesCases[tousLesAliens[i]].getAttribute('data-left') === 'true')
        {
            // Si les aliens sont complètement à gauche
            if(descendreGauche)
            {
                direction = 20;
                setTimeout(() =>
                {
                    descendreGauche = false;
                }, 50);
            }
            else if(descendreGauche === false)
            {
                direction = 1;
            }
            descendreDroite = true;
        }
    }

    // Suppression de l'alien qui se déplace
    for(let i = 0 ; i < tousLesAliens.length ; i++)
    {
        toutesLesCases[tousLesAliens[i]].classList.remove('alien');
    }

    // Modification de position de l'alien
    for(let i = 0 ; i < tousLesAliens.length ; i++)
    {
        tousLesAliens[i] += direction;
    }

    // Affichage d'un alien qui se déplace
    for(let i = 0 ; i < tousLesAliens.length ; i++)
    {
        toutesLesCases[tousLesAliens[i]].classList.add('alien');
    }

    // Si un ennemi touche le vaisseau
    if(toutesLesCases[vaisseauPosition].classList.contains('alien', 'vaisseau'))
    {
        score.innerHTML = '!!! GAME OVER !!!';
        toutesLesCases[vaisseauPosition].classList.add('alienTouche');
        clearInterval(aliensId);
    }

    // Si un ennemi atteind la ligne du vaisseau
    for(let i = 0 ; i <= tousLesAliens.length ; i++)
    {
        if(tousLesAliens[i] > toutesLesCases.length - width)
        {
            score.innerHTML = '!!! GAME OVER !!!';
            clearInterval(aliensId);
        }
    }
}

// Fonction de tir
function tirLaser(e)
{
    let laserId;
    let laserEnCours = vaisseauPosition;

    function deplaceLaser()
    {
        // Gestion de l'affichage du tir laser
        toutesLesCases[laserEnCours].classList.remove('tirVaisseau');
        laserEnCours -= width;
        toutesLesCases[laserEnCours].classList.add('tirVaisseau');

        // Si les aliens sont touchés
        if(toutesLesCases[laserEnCours].classList.contains('alien'))
        {
            // Suppression de l'alien et du tir laser
            toutesLesCases[laserEnCours].classList.remove('tirVaisseau');
            toutesLesCases[laserEnCours].classList.remove('alien');

            // Affichage du tir d'impact réusssi
            toutesLesCases[laserEnCours].classList.add('alienTouche');

            // Suppression des aliens détruits de la liste des aliens
            tousLesAliens = tousLesAliens.filter(el => el !== laserEnCours);

            // Suppression du laser d'impact réussi
            setTimeout(() =>
            {
                toutesLesCases[laserEnCours].classList.remove('alienTouche');
            }, 250);
            clearInterval(laserId);

            // Ajouter 1 au résultat
            resultat += 1;
            
            // Si les tous les aliens sont détruits
            if(resultat === 36)
            {
                // Message de victoire
                score.innerHTML = "Bravo, c'est gagné !"
                setTimeout(() =>
                {
                    location.reload();
                },2000);
            }
            else
            {
                // Afficher score en cours
                scoreResultat.innerHTML = resultat;
            }
        }

        // Si le laser arrive en haut du jeu
        if(laserEnCours < width)
        {
            clearInterval(laserId);
            setTimeout(() =>
            {
                toutesLesCases[laserEnCours].classList.remove('tirVaisseau');
            });
        }
    }

    // Si on appuie sur la touche Espace
    if(e.keyCode === 32)
    {
        laserId = setInterval(() =>
        {
            deplaceLaser();
        }, 100);
    }
}
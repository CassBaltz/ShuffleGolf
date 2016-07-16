# Shuffleboard

[Live Putt-Putt] (https://cassbaltz.github.io/Shuffleboard/)

Shuffleboard is a modified, single-player shuffleboard game that allows players to test their skill. The game uses JavaScript, CSS, and HTML. Specifically, the animation and gameplay are displayed using HTML5's canvas feature.

## Rules

Players are given three miss attempts per series. A series consists of a culmination of levels achieved before the three miss attempts have been realized. A splash page explains the rules and the game is played on the same board with increasing levels of difficulty as players progress through the game. The game is modified to accommodate single-player functionality by incorporating multiple obstacles, multiple attempts per turn, and a smaller target. So a player progresses toward the target with multiple strategic shots, like golf, instead of one throw across the table per disk -- like the standard version. During each turn, a player is given three attempts to get their disk into the target area. If the disk goes off the board, the turn is over. The same is true if there have been three attempts without landing in the target area.

## Gameplay

The disk slides by having a player click and hold the disk with a mouse pointer, drag the mouse back -- like a slingshot or standard slide in shuffleboard, and then release the mouse with desired direction and speed. The disk slides very similarly to a standard disk using a fairly simple deceleration formula. After a turn, the player will either advance to the next level or have to replay the same level with one less turn, depending on how he or she fared during the previous turn. Points are accumulated by advancing levels and using less than the allotted strokes available to score in the target. This game has no database attached, so score persistence does not exist. That could eventually be added later.

## Development

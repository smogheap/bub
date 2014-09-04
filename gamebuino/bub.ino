#include <SPI.h>
#include <Gamebuino.h>
Gamebuino gb;
#include <avr/pgmspace.h>

extern const byte font3x5[];
extern const byte font5x7[];

/* from sprites */
extern const byte PROGMEM title[];
extern const byte PROGMEM orkstand[];
extern const byte PROGMEM orkdown[];
extern const byte PROGMEM orkup[];
extern const byte PROGMEM bubble[];
extern const byte PROGMEM wall[];
extern const byte PROGMEM ladder[];
extern const byte PROGMEM key[];
extern const byte PROGMEM door[];
extern const byte PROGMEM right[];
extern const byte PROGMEM left[];
extern const byte PROGMEM crate[];
extern const byte PROGMEM flag[];

/* from levels */
extern const char PROGMEM levels[];

/* from sounds */
extern const int soundfx[][8];


/* game variables */
uint8_t dir = NOFLIP;
int TILE_W = 8;
int TILE_H = 6;
int level = 0;
char lvldata[64] = "";
const byte *ork = orkstand;
int orkx = 0;
int orky = 0;
int maxinv = 2;
int bubs = 0;
int keys = 0;
int gameover = 0;


void sfx(int fxno, int channel) {
  gb.sound.command(0, soundfx[fxno][6], 0, channel); // set volume
  gb.sound.command(1, soundfx[fxno][0], 0, channel); // set waveform
  gb.sound.command(2, soundfx[fxno][5], -soundfx[fxno][4], channel); // set volume slide
  gb.sound.command(3, soundfx[fxno][3], soundfx[fxno][2] - 58, channel); // set pitch slide
  gb.sound.playNote(soundfx[fxno][1], soundfx[fxno][7], channel); // play note
}

void loadlevel(int level) {
  int i;
  for(i = 0; i < 64; i++) {
    lvldata[i] = (char)pgm_read_byte(levels + (level * 64) + i);
  }
  bubs = 0;
  keys = 0;
  gameover = 0;
}

char cell(int x, int y) {
  if(x < 0 || x > 7 || y < 0 || y > 7) {
    return 0;
  }
  return lvldata[(y * 8) + x];
}

int isempty(char cell) {
  return (cell == ' ' || cell == '4') ? 1 : 0;
}

//FIXME: crate moving through flag erases the flag
int moveto(int x, int y, int fromx, int fromy) {
  int stay = 0;
  char who = cell(fromx, fromy);
  if(fromx == orkx && fromy == orky) {
    who = '@'; //special mode
  }
  char targ = cell(x, y);

  if(who != '@') {
    if(!isempty(targ)) {
      stay = 1;
    }
  } else {
    if(!targ || targ == '#' || targ == '=') {
      sfx(0, 0);
      return 0;
    } else if(targ == 'o') {
      if(bubs + keys < maxinv) {
        lvldata[(y * 8) + x] = ' ';
        sfx(1, 0);
        stay = 1;
        bubs++;
      } else {
        return 0;
      }
    } else if(targ == '-') {
      if(bubs + keys < maxinv) {
        lvldata[(y * 8) + x] = ' ';
        sfx(1, 0);
        stay = 1;
        keys++;
      } else {
        return 0;
      }
    } else if(targ == 'X') {
      if(!keys) {
        sfx(0, 0);
        return 0;
      }
      stay = 1;
      keys--;
      lvldata[(y * 8) + x] = ' ';
      sfx(4, 0);
    }
  }

  if(stay) {
    return 0;
  }

  if(who != '@') {
    lvldata[(y * 8) + x] = who;
    lvldata[(fromy * 8) + fromx] = ' ';
  } else {
    orkx = x;
    orky = y;
    if(targ == '4') {
      gameover = 1;
      sfx(5, 0);
    }
  }
  return 1;
}

void fall(int fromx, int fromy) {
  char who = cell(fromx, fromy);
  if(fromx == orkx && fromy == orky) {
    who = '@'; //special mode
  }
  int x = fromx;
  int y = fromy;
  int origy = y;
  char below = cell(x, y + 1);
  int fell = 0;

  if(cell(x, y) == 'H') {
    return;
  }

  while(below && isempty(below)) {
    if(moveto(x, y + 1, x, y)) {
      y++;
      fell++;
      below = cell(x, y + 1);
    } else {
      below = 0;
    }
  }

  if(fell) {
    sfx(0, 0);
  }
}

void allfall() {
  int x;
  int y;
  for(y = 7; y >= 0; y--) {
    for(x = 0; x < 8; x++) {
      if(cell(x, y) == '=' || (x == orkx && y == orky)) {
        fall(x, y);
      }
    }
  }
}

int movedown() {
  int moved = 0;
  char targ = cell(orkx, orky + 1);

  ork = orkdown;

  if(cell(orkx, orky + 1) == 'H') {
    moveto(orkx, orky + 1, orkx, orky);
    //sfx("climb");
    return 0;
  } else if(cell(orkx, orky) == '<' || cell(orkx, orky) == '>') {
    return 0;
  } else if(!cell(orkx, orky + 1)) {
    if(cell(orkx, orky) == 'H') {
      fall(orkx, orky);
      sfx(0, 0);
      return 0;
    }
  } else if(cell(orkx, orky) == 'H') {
    if(isempty(targ)) {
       moved = moveto(orkx, orky + 1, orkx, orky);
      fall(orkx, orky);
    }
    return moved;
  }

  if(!bubs && !keys) {
    fall(orkx, orky);
    sfx(6, 0);
    return 0;
  }

  // plop and climb
  targ = cell(orkx, orky - 1);
  if(!targ ||
     (!isempty(targ) && targ != 'H' && targ != '<' && targ != '>')) {
    sfx(0, 0);
    return 0;
  }
  if(bubs) {
    lvldata[(orky * 8) + orkx] = 'o';
    bubs--;
    sfx(2, 0);
  } else if(keys) {
    lvldata[(orky * 8) + orkx] = '-';
    keys--;
    sfx(2, 0);
  }
  moveto(orkx, orky - 1, orkx, orky);
  fall(orkx, orky);
  return 1;
}

void moveup() {
  int moved = 0;
  ork = orkup;
  if(!cell(orkx, orky - 1)) {
    sfx(0, 0);
    return;
  }
  if(cell(orkx, orky) == 'H' &&
     (cell(orkx, orky - 1) == 'H' || isempty(cell(orkx, orky - 1)))) {
    moveto(orkx, orky - 1, orkx, orky);
    //sfx("climb");
    return;
  } else if(!cell(orkx, orky + 1)) {
    moved = movedown();
  } else if(cell(orkx, orky + 1) != 'H') {
    moved = movedown();
  }
  if(!moved) {
    ork = orkup;
    sfx(6, 0);
  }
}

void moveleft() {
  char kick = cell(orkx - 1, orky);

  ork = orkstand;  
  dir = FLIPH;
  if(!cell(orkx - 1, orky) || cell(orkx - 1, orky) == '>') {
    sfx(0, 0);
    return;
  }
  if(kick == '=') {
    ork = orkdown;
    sfx(0, 0);
    moveto(orkx - 2, orky, orkx - 1, orky);
    allfall();
    return;
  }
  if(moveto(orkx - 1, orky, orkx, orky)) {
    //sfx("step");
  }
  allfall();
}
void moveright() {
  char kick = cell(orkx + 1, orky);

  ork = orkstand;  
  dir = NOFLIP;
  if(!cell(orkx + 1, orky) || cell(orkx + 1, orky) == '<') {
    sfx(0, 0);
    return;
  }
  if(kick == '=') {
    ork = orkdown;
    sfx(0, 0);
    moveto(orkx + 2, orky, orkx + 1, orky);
    allfall();
    return;
  }
  if(moveto(orkx + 1, orky, orkx, orky)) {
    //sfx("step");
  }
  allfall();
}

void next() {
  if(level >= 99) {
    level = 0;
  } else {
    level++;
  }
  loadlevel(level);
}


void setup() {
  gb.begin();
  gb.battery.show = true;
  loadlevel(0);
  gb.titleScreen(title);
}

void loop() {
  if(gb.update()) {
    if(gb.buttons.pressed(BTN_C)) {
      if(gameover) {
        next();
      } else {
        gb.titleScreen(title);
      }
    }
    if(gb.buttons.pressed(BTN_B)) {
      next();
    }
    if(gb.buttons.pressed(BTN_A)) {
      if(gameover) {
        next();
      } else {
        loadlevel(level);
        sfx(3, 0);
      }
    }
    if(gb.buttons.pressed(BTN_LEFT)) {
      if(gameover) {
        next();
      } else {
        moveleft();
      }
      //ork = orkstand;
      //orkx--;
      //dir = FLIPH;
    }
    if(gb.buttons.pressed(BTN_RIGHT)) {
      if(gameover) {
        next();
      } else {
        moveright();
      }
      //ork = orkstand;
      //orkx++;
      //dir = NOFLIP;
    }
    if(gb.buttons.pressed(BTN_UP)) {
      if(gameover) {
        next();
      } else {
        moveup();
      }
      //ork = orkup;
      //orky--;
    }
    if(gb.buttons.pressed(BTN_DOWN)) {
      if(gameover) {
        next();
      } else {
        movedown();
      }
      //ork = orkdown;
      //orky++;
    }
  }

  /* set screen */
  if(gameover) {
    gb.display.setColor(WHITE, BLACK);
    gb.display.fillScreen(BLACK);
  } else {
    gb.display.setColor(BLACK, WHITE);
  }
  
  /* draw level */
  int i = 0;
  int j = 0;
  const byte *block;
  for(i = 0; i < 8; i++) {
    for(j = 0; j < 8; j++) {
      block = NULL;
      switch(lvldata[(i * 8) + j]) {
        case 'o':
          block = bubble;
          break;
        case '#':
          block = wall;
          break;
        case 'H':
          block = ladder;
          break;
        case '-':
          block = key;
          break;
        case 'X':
          block = door;
          break;
        case '>':
          block = right;
          break;
        case '<':
          block = left;
          break;
        case '=':
          block = crate;
          break;
        case '4':
          block = flag;
          break;
        case '@':
          orkx = j;
          orky = i;
          ork = orkstand;
          dir = NOFLIP;
          lvldata[(i * 8) + j] = ' ';
          break;
        default:
          break;
      }
      if(block) {
        gb.display.drawBitmap(j * TILE_W, i * TILE_H, block, NOROT, NOFLIP);
      }
    }
  }
  
  /* draw ork */
  gb.display.drawBitmap(orkx * TILE_W, orky * TILE_H, ork, NOROT, dir);

  /* draw ui */
  gb.display.drawFastVLine(64, 0, 48);
  gb.display.drawBitmap(65, 42, flag, NOROT, NOFLIP);
  gb.display.setFont(font5x7);
  gb.display.cursorX = 73;
  gb.display.cursorY = 41;
  gb.display.print(level);

  /* draw inventory */
  gb.display.drawRect(68, 16, TILE_W + 4, (TILE_H * maxinv) + 4);
  gb.display.drawFastVLine(67, 16, TILE_H + 2);
  gb.display.drawFastVLine(67 + TILE_W + 5, 16, TILE_H + 2);
  i = 18;
  for(j = 0; j < bubs; j++) {
    gb.display.drawBitmap(70, i, bubble, NOROT, NOFLIP);
    i += TILE_H;
  }
  for(j = 0; j < keys; j++) {
    gb.display.drawBitmap(70, i, key, NOROT, NOFLIP);
    i += TILE_H;
  }
}

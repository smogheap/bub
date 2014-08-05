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


/* game variables */
uint8_t dir = NOFLIP;
int TILE_W = 8;
int TILE_H = 6;
int level = 0;
int maxinv = 2;
const byte *ork = orkstand;
int orkx = 0;
int orky = 0;
int loaded = 0;


void setup() {
  gb.begin();
  gb.titleScreen(title);
  gb.battery.show = true;
}

void loop() {
  if(gb.update()) {
    if(gb.buttons.pressed(BTN_C)) {
      gb.titleScreen(title);
    }
    if(gb.buttons.pressed(BTN_B)) {
      if(level > 0) {
        level = 0;
      } else {
        level++;
      }
      loaded = 0;
    }
    if(gb.buttons.pressed(BTN_A)) {
      loaded = 0;
      //todo: local dirty copy
    }
    if(gb.buttons.pressed(BTN_LEFT)) {
      ork = orkstand;
      orkx--;
      dir = FLIPH;
    }
    if(gb.buttons.pressed(BTN_RIGHT)) {
      ork = orkstand;
      orkx++;
      dir = NOFLIP;
    }
    if(gb.buttons.pressed(BTN_UP)) {
      ork = orkup;
      orky--;
    }
    if(gb.buttons.pressed(BTN_DOWN)) {
      ork = orkdown;
      orky++;
    }
  }
  
  /* draw level */
  int i = 0;
  int j = 0;
  int lvl = level * 64;
  const byte *block;
  for(i = 0; i < 8; i++) {
    for(j = 0; j < 8; j++) {
      block = NULL;
      switch(pgm_read_byte(levels + (lvl) + (i * 8) + j)) {
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
          if(!loaded) {
            orkx = j;
            orky = i;
            ork = orkstand;
            dir = NOFLIP;
            loaded = 1;
          }
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
}

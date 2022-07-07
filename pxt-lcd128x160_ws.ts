/*****************************************************************************
* | File      	:   pxt-lcd128x160_ws.ts
* | Author      :   Franz X. Stolz
* | Function    :   pxt extension for 1.8inch lcd display from waveshare
* | Info        :   it uses the SPI-interface, be aware about proper SPI-configuration
*----------------
* | This version:   v1.0
* | Date        :   2022-06-30
* | Info        :   for calliope mini (rev2) and makecode editor
*
******************************************************************************/
let GUI_BACKGROUND_COLOR = 1
//let FONT_BACKGROUND_COLOR = 1
//let FONT_FOREGROUND_COLOR = 0

let LCD_WIDTH = 160  //LCD width
let LCD_HEIGHT = 128 //LCD height

/**
 * Color Scheme of Display
 */
enum ColorScheme {
    RGB = 0xC0,
    BGR = 0xC8
}

enum COLOR {
    WHITE = 0xFFFF,
    BLACK = 0x0000,
    BLUE = 0x001F,
    BRED = 0XF81F,
    GRED = 0XFFE0,
    GBLUE = 0X07FF,
    RED = 0xF800,
    MAGENTA = 0xF81F,
    GREEN = 0x07E0,
    CYAN = 0x7FFF,
    YELLOW = 0xFFE0,
    BROWN = 0XBC40,
    BRRED = 0XFC07,
    GRAY = 0X8430
}

enum DOT_PIXEL {
    DOT_PIXEL_1 = 1,
    DOT_PIXEL_2,
    DOT_PIXEL_3,
    DOT_PIXEL_4
};

enum LINE_STYLE {
    LINE_SOLID = 0,
    LINE_DOTTED,
};

enum DRAW_FILL {
    DRAW_EMPTY = 0,
    DRAW_FULL,
};

/**
    * TFT Commands
    */
enum TFTCommands {
    NOP = 0x00,
    SWRESET = 0x01,
    SLPOUT = 0x11,
    NORON = 0x13,
    INVOFF = 0x20,
    INVON = 0x21,
    DISPOFF = 0x28,
    DISPON = 0x29,
    CASET = 0x2A,
    RASET = 0x2B,
    RAMWR = 0x2C,
    MADCTL = 0x36, // use to set RGB-color ordering ->  RGB or BGR
    COLMOD = 0x3A,
    FRMCTR1 = 0xB1,
    FRMCTR2 = 0xB2,
    FRMCTR3 = 0xB3,
    INVCTR = 0xB4,
    PWCTR1 = 0xC0,
    PWCTR2 = 0xC1,
    PWCTR3 = 0xC2,
    PWCTR4 = 0xC3,
    PWCTR5 = 0xC4,
    VMCTR1 = 0xC5,
    GMCTRP1 = 0xE0,
    GMCTRN1 = 0xE1,
    DELAY = 0xFFFF
}


pins.spiPins(DigitalPin.P3, DigitalPin.C16, DigitalPin.P0)
//pins.spiFormat(8, 2)
pins.spiFrequency(4000000)

//% weight=20 color=#436EEE icon="\uf108"
namespace LCD1IN8 {

// put font table into Flash-ROM memory
// font size is 12x7 pixel
export const font12x7 = hex`

000000000000000000000000
001010101010000010000000
006C48480000000000000000
001414287C287C2850500000
001038404038487010100000
002050200C70081408000000
000000182020544834000000
001010101000000000000000
000808101010101010080800
002020101010101010202000
00107C102828000000000000
0000101010FE101010000000
000000000000001810302000
00000000007C000000000000
000000000000003030000000
000404080810102020400000
003844444444444438000000
00301010101010107C000000
00384404081020447C000000
003844041804044438000000
000C141424447E040E000000
003C20203804044438000000
001C20407844444438000000
007C44040808081010000000
003844443844444438000000
00384444443C040870000000
000000303000003030000000
000000181800001830200000
00000C10608060100C000000
000000007C007C0000000000
0000C02018041820C0000000
000018240408100030000000
3844444C54544C4044380000
0030102828287C44EE000000
00F8444478444444F8000000
003C44404040404438000000
00F0484444444448F0000000
00FC445070504044FC000000
007E22283828202070000000
003C4440404E444438000000
00EE44447C444444EE000000
007C1010101010107C000000
003C08080848484830000000
00EE444850704844E6000000
00702020202024247C000000
00EE6C6C54544444EE000000
00EE64645454544CEC000000
003844444444444438000000
007824242438202070000000
0038444444444444381C0000
00F8444444784844E2000000
00344C403804046458000000
00FE92101010101038000000
00EE44444444444438000000
00EE44442828281010000000
00EE44445454545428000000
00C6442810102844C6000000
00EE44282810101038000000
007C4408101020447C000000
003820202020202020203800
004020202010100808080000
003808080808080808083800
001010284400000000000000
0000000000000000000000FE
001008000000000000000000
00000038443C44443E000000
00C0405864444444F8000000
0000003C4440404438000000
000C04344C4444443E000000
00000038447C40403C000000
001C207C202020207C000000
000000364C4444443C043800
00C0405864444444EE000000
00100070101010107C000000
001000780808080808087000
00C0405C48705048DC000000
00301010101010107C000000
000000E854545454FE000000
000000D864444444EE000000
000000384444444438000000
000000D8644444447840E000
000000364C4444443C040E00
0000006C302020207C000000
0000003C4438044478000000
0000207C202020221C000000
000000CC4444444C36000000
000000EE4444282810000000
000000EE4454545428000000
000000CC48303048CC000000
000000EE4424281810107800
0000007C481020447C000000
000810101010201010100800
001010101010101010100000
002010101010081010102000
000000000024580000000000`;


    //% blockId=LCD_Init
    //% blockGap=8
    //% block="Initialize Display"
    //% weight=200
    export function LCD_Init(): void {

        //ST7735R Frame Rate
        LCD_WriteReg(0xB1);
        LCD_WriteData_8Bit(0x01);
        LCD_WriteData_8Bit(0x2C);
        LCD_WriteData_8Bit(0x2D);

        LCD_WriteReg(0xB2);
        LCD_WriteData_8Bit(0x01);
        LCD_WriteData_8Bit(0x2C);
        LCD_WriteData_8Bit(0x2D);

        LCD_WriteReg(0xB3);
        LCD_WriteData_8Bit(0x01);
        LCD_WriteData_8Bit(0x2C);
        LCD_WriteData_8Bit(0x2D);
        LCD_WriteData_8Bit(0x01);
        LCD_WriteData_8Bit(0x2C);
        LCD_WriteData_8Bit(0x2D);

        LCD_WriteReg(0xB4); //Column inversion
        LCD_WriteData_8Bit(0x07);

        //ST7735R Power Sequence
        LCD_WriteReg(0xC0);
        LCD_WriteData_8Bit(0xA2);
        LCD_WriteData_8Bit(0x02);
        LCD_WriteData_8Bit(0x84);
        LCD_WriteReg(0xC1);
        LCD_WriteData_8Bit(0xC5);

        LCD_WriteReg(0xC2);
        LCD_WriteData_8Bit(0x0A);
        LCD_WriteData_8Bit(0x00);

        LCD_WriteReg(0xC3);
        LCD_WriteData_8Bit(0x8A);
        LCD_WriteData_8Bit(0x2A);
        LCD_WriteReg(0xC4);
        LCD_WriteData_8Bit(0x8A);
        LCD_WriteData_8Bit(0xEE);

        LCD_WriteReg(0xC5); //VCOM
        LCD_WriteData_8Bit(0x0E);

        //ST7735R Gamma Sequence
        LCD_WriteReg(0xe0);
        LCD_WriteData_8Bit(0x0f);
        LCD_WriteData_8Bit(0x1a);
        LCD_WriteData_8Bit(0x0f);
        LCD_WriteData_8Bit(0x18);
        LCD_WriteData_8Bit(0x2f);
        LCD_WriteData_8Bit(0x28);
        LCD_WriteData_8Bit(0x20);
        LCD_WriteData_8Bit(0x22);
        LCD_WriteData_8Bit(0x1f);
        LCD_WriteData_8Bit(0x1b);
        LCD_WriteData_8Bit(0x23);
        LCD_WriteData_8Bit(0x37);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit(0x07);
        LCD_WriteData_8Bit(0x02);
        LCD_WriteData_8Bit(0x10);

        LCD_WriteReg(0xe1);
        LCD_WriteData_8Bit(0x0f);
        LCD_WriteData_8Bit(0x1b);
        LCD_WriteData_8Bit(0x0f);
        LCD_WriteData_8Bit(0x17);
        LCD_WriteData_8Bit(0x33);
        LCD_WriteData_8Bit(0x2c);
        LCD_WriteData_8Bit(0x29);
        LCD_WriteData_8Bit(0x2e);
        LCD_WriteData_8Bit(0x30);
        LCD_WriteData_8Bit(0x30);
        LCD_WriteData_8Bit(0x39);
        LCD_WriteData_8Bit(0x3f);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit(0x07);
        LCD_WriteData_8Bit(0x03);
        LCD_WriteData_8Bit(0x10);

        LCD_WriteReg(0xF0); //Enable test command
        LCD_WriteData_8Bit(0x01);

        LCD_WriteReg(0xF6); //Disable ram power save mode
        LCD_WriteData_8Bit(0x00);

        LCD_WriteReg(0x3A); //65k mode
        LCD_WriteData_8Bit(0x05);

        LCD_WriteReg(0x36); //MX, MY, RGB mode
        LCD_WriteData_8Bit(0xF7 & 0xA0); //RGB color filter panel

        //sleep out
        LCD_WriteReg(0x11);
        control.waitMicros(1000);

        // turn on display
        LCD_WriteReg(0x29);
 
    }

    //% blockId=LCD_Clear
    //% blockGap=8
    //% block="LCD Clear"
    //% weight=195
    export function LCD_Clear(): void {
        LCD_SetWindows(0, 0, LCD_WIDTH, LCD_HEIGHT);
        LCD_SetColor(0x0000, LCD_WIDTH + 2, LCD_HEIGHT + 2);
    }

    //% blockId=LCD_Filling
    //% blockGap=8
    //% block="Filling Color %Color"
    //% weight=195
    export function LCD_Filling(Color: COLOR): void {
        LCD_SetWindows(0, 0, LCD_WIDTH, LCD_HEIGHT);
        LCD_SetColor(Color, LCD_WIDTH + 2, LCD_HEIGHT + 2);
    }

    
    function LCD_WriteReg(reg: number): void {
        pins.digitalWritePin(DigitalPin.P1, 0);
        pins.digitalWritePin(DigitalPin.P2, 0);
        pins.spiWrite(reg);
        pins.digitalWritePin(DigitalPin.P2, 1);
    }

    function LCD_WriteData_8Bit(Data: number): void {
        pins.digitalWritePin(DigitalPin.P1, 1);
        pins.digitalWritePin(DigitalPin.P2, 0);
        pins.spiWrite(Data);
        pins.digitalWritePin(DigitalPin.P2, 1);
    }

    function LCD_WriteData_Buf(Buf: number, len: number): void {
        pins.digitalWritePin(DigitalPin.P1, 1);
        pins.digitalWritePin(DigitalPin.P2, 0);
        let i = 0;
        for (i = 0; i < len; i++) {
            pins.spiWrite((Buf >> 8));
            pins.spiWrite((Buf & 0XFF));
        }
        pins.digitalWritePin(DigitalPin.P2, 1);
    }

    function LCD_SetWindows(Xstart: number, Ystart: number, Xend: number, Yend: number): void {
        //set the X coordinates
        LCD_WriteReg(0x2A);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit((Xstart & 0xff) + 1);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit(((Xend - 1) & 0xff) + 1);

        //set the Y coordinates
        LCD_WriteReg(0x2B);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit((Ystart & 0xff) + 2);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit(((Yend - 1) & 0xff) + 2);

        LCD_WriteReg(0x2C);   // wieso hier 0x2C -> Memory Write Befehl, danach sollten direkt RAM-Daten folgen  -> das wäre noch zu prüfen
    }

    function LCD_SetColor(Color: number, Xpoint: number, Ypoint: number,): void {
        LCD_WriteData_Buf(Color, Xpoint * Ypoint);
    }

    function LCD_SetPoint(Xpoint: number, Ypoint: number, Color: number): void {

        LCD_SetWindows(Xpoint, Ypoint, Xpoint+1, Ypoint+1) 
        //LCD_WriteReg(0x2C);   // eigentlich doppelt gemoppelt, mit LCD_SetWindows wird dieser Befehl bereits geschrieben
        LCD_WriteData_8Bit(Color >> 8);
        LCD_WriteData_8Bit(Color & 0xff);
       
    }

    //% blockId=DrawPoint
    //% blockGap=8
    //% block="Draw Point|x %Xpoint|y %Ypoint|Color %Color|Point Size %Dot_Pixel"
    //% Xpoint.min=1 Xpoint.max=160 Ypoint.min=1 Ypoint.max=128
    //% Color.min=0 Color.max=65535
    //% weight=150
    export function DrawPoint(Xpoint: number, Ypoint: number, Color: number, Dot_Pixel: DOT_PIXEL): void {
        let XDir_Num, YDir_Num;
        for (XDir_Num = 0; XDir_Num < Dot_Pixel; XDir_Num++) {
            for (YDir_Num = 0; YDir_Num < Dot_Pixel; YDir_Num++) {
                LCD_SetPoint(Xpoint + XDir_Num - Dot_Pixel, Ypoint + YDir_Num - Dot_Pixel, Color);
            }
        }
    }

    //% blockId=DrawLine
    //% blockGap=8
    //% block="Draw Line|Xstart %Xstart|Ystart %Ystart|Xend %Xend|Yend %Yend|Color %Color|width %Line_width|Style %Line_Style"
    //% Xstart.min=1 Xstart.max=160 Ystart.min=1 Ystart.max=128
    //% Xend.min=1 Xend.max=160 Yend.min=1 Yend.max=128
    //% Color.min=0 Color.max=65535
    //% weight=140
    export function DrawLine(Xstart: number, Ystart: number, Xend: number, Yend: number, Color: number, Line_width: DOT_PIXEL, Line_Style: LINE_STYLE): void {
        if (Xstart > Xend)
            Swop_AB(Xstart, Xend);
        if (Ystart > Yend)
            Swop_AB(Ystart, Yend);

        let Xpoint = Xstart;
        let Ypoint = Ystart;
        let dx = Xend - Xstart >= 0 ? Xend - Xstart : Xstart - Xend;
        let dy = Yend - Ystart <= 0 ? Yend - Ystart : Ystart - Yend;

        // Increment direction, 1 is positive, -1 is counter;
        let XAddway = Xstart < Xend ? 1 : -1;
        let YAddway = Ystart < Yend ? 1 : -1;

        //Cumulative error
        let Esp = dx + dy;
        let Line_Style_Temp = 0;

        for (; ;) {
            Line_Style_Temp++;
            //Painted dotted line, 2 point is really virtual
            if (Line_Style == LINE_STYLE.LINE_DOTTED && Line_Style_Temp % 3 == 0) {
                DrawPoint(Xpoint, Ypoint, GUI_BACKGROUND_COLOR, Line_width);
                Line_Style_Temp = 0;
            } else {
                DrawPoint(Xpoint, Ypoint, Color, Line_width);
            }
            if (2 * Esp >= dy) {
                if (Xpoint == Xend) break;
                Esp += dy
                Xpoint += XAddway;
            }
            if (2 * Esp <= dx) {
                if (Ypoint == Yend) break;
                Esp += dx;
                Ypoint += YAddway;
            }
        }
    }

    //% blockId=DrawRectangle
    //% blockGap=8
    //% block="Draw Rectangle|Xstart2 %Xstart2|Ystart2 %Ystart2|Xend2 %Xend2|Yend2 %Yend2|Color %Color|Filled %Filled |Line width %Dot_Pixel"
    //% Xstart2.min=1 Xstart2.max=160 Ystart2.min=1 Ystart2.max=128 
    //% Xend2.min=1 Xend2.max=160 Yend2.min=1 Yend2.max=128
    //% Color.min=0 Color.max=65535
    //% weight=130
    export function DrawRectangle(Xstart2: number, Ystart2: number, Xend2: number, Yend2: number, Color: number, Filled: DRAW_FILL, Dot_Pixel: DOT_PIXEL): void {
        if (Xstart2 > Xend2)
            Swop_AB(Xstart2, Xend2);
        if (Ystart2 > Yend2)
            Swop_AB(Ystart2, Yend2);

        let Ypoint = 0;
        if (Filled) {
            for (Ypoint = Ystart2; Ypoint < Yend2; Ypoint++) {
                DrawLine(Xstart2, Ypoint, Xend2, Ypoint, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
            }
        } else {
            DrawLine(Xstart2, Ystart2, Xend2, Ystart2, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
            DrawLine(Xstart2, Ystart2, Xstart2, Yend2, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
            DrawLine(Xend2, Yend2, Xend2, Ystart2, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
            DrawLine(Xend2, Yend2, Xstart2, Yend2, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
        }
    }

    //% blockId=DrawCircle
    //% blockGap=8
    //% block="Draw Circle|X_Center %X_Center|Y_Center %Y_Center|Radius %Radius|Color %Color|Filled %Draw_Fill|Line width %Dot_Pixel"
    //% X_Center.min=1 X_Center.max=160 Y_Center.min=1 Y_Center.max=128
    //% Radius.min=0 Radius.max=160
    //% Color.min=0 Color.max=65535
    //% weight=120
    export function DrawCircle(X_Center: number, Y_Center: number, Radius: number, Color: number, Draw_Fill: DRAW_FILL, Dot_Pixel: DOT_PIXEL): void {
        //Draw a circle from(0, R) as a starting point
        let XCurrent = 0;
        let YCurrent = Radius;

        //Cumulative error,judge the next point of the logo
        let Esp = 3 - (Radius << 1);

        let sCountY = 0;
        if (Draw_Fill == DRAW_FILL.DRAW_FULL) {//DrawPoint(Xpoint, Ypoint, GUI_BACKGROUND_COLOR, Line_width);
            while (XCurrent <= YCurrent) { //Realistic circles
                for (sCountY = XCurrent; sCountY <= YCurrent; sCountY++) {
                    DrawPoint(X_Center + XCurrent, Y_Center + sCountY, Color, DOT_PIXEL.DOT_PIXEL_1);             //1
                    DrawPoint(X_Center - XCurrent, Y_Center + sCountY, Color, DOT_PIXEL.DOT_PIXEL_1);             //2
                    DrawPoint(X_Center - sCountY, Y_Center + XCurrent, Color, DOT_PIXEL.DOT_PIXEL_1);             //3
                    DrawPoint(X_Center - sCountY, Y_Center - XCurrent, Color, DOT_PIXEL.DOT_PIXEL_1);             //4
                    DrawPoint(X_Center - XCurrent, Y_Center - sCountY, Color, DOT_PIXEL.DOT_PIXEL_1);             //5
                    DrawPoint(X_Center + XCurrent, Y_Center - sCountY, Color, DOT_PIXEL.DOT_PIXEL_1);             //6
                    DrawPoint(X_Center + sCountY, Y_Center - XCurrent, Color, DOT_PIXEL.DOT_PIXEL_1);             //7
                    DrawPoint(X_Center + sCountY, Y_Center + XCurrent, Color, DOT_PIXEL.DOT_PIXEL_1);
                }
                if (Esp < 0)
                    Esp += 4 * XCurrent + 6;
                else {
                    Esp += 10 + 4 * (XCurrent - YCurrent);
                    YCurrent--;
                }
                XCurrent++;
            }
        } else { //Draw a hollow circle
            while (XCurrent <= YCurrent) {
                DrawPoint(X_Center + XCurrent, Y_Center + YCurrent, Color, Dot_Pixel);             //1
                DrawPoint(X_Center - XCurrent, Y_Center + YCurrent, Color, Dot_Pixel);             //2
                DrawPoint(X_Center - YCurrent, Y_Center + XCurrent, Color, Dot_Pixel);             //3
                DrawPoint(X_Center - YCurrent, Y_Center - XCurrent, Color, Dot_Pixel);             //4
                DrawPoint(X_Center - XCurrent, Y_Center - YCurrent, Color, Dot_Pixel);             //5
                DrawPoint(X_Center + XCurrent, Y_Center - YCurrent, Color, Dot_Pixel);             //6
                DrawPoint(X_Center + YCurrent, Y_Center - XCurrent, Color, Dot_Pixel);             //7
                DrawPoint(X_Center + YCurrent, Y_Center + XCurrent, Color, Dot_Pixel);             //0

                if (Esp < 0)
                    Esp += 4 * XCurrent + 6;
                else {
                    Esp += 10 + 4 * (XCurrent - YCurrent);
                    YCurrent--;
                }
                XCurrent++;
            }
        }
    }

    //% blockId=DisString
    //% blockGap=8
    //% block="Show String|X %Xchar|Y %Ychar|char %ch|Color %Color"
    //% Xchar.min=1 Xchar.max=160 Ychar.min=1 Ychar.max=128 
    //% weight=100
    export function DisString(Xchar: number, Ychar: number, ch: string, col: COLOR): void {
        let Xpoint = Xchar;
        let Ypoint = Ychar;
        let Font_Height = 12;
        let Font_Width = 7;
        let ch_len = ch.length;
        let i = 0;
        for (i = 0; i < ch_len; i++) {
            let ch_asicc = ch.charCodeAt(i) - 32;//NULL = 32
            //let ch_asicc = ch.charCodeAt(i) ;  //NULL = 32
            //basic.showNumber(ch_asicc);
            //basic.pause(800)

            let Char_Offset = ch_asicc * 12;

            if ((Xpoint + Font_Width) > 160) {
                Xpoint = Xchar;
                Ypoint += Font_Height;
            }

            // If the Y direction is full, reposition to(Xstart, Ystart)
            if ((Ypoint + Font_Height) > 128) {
                Xpoint = Xchar;
                Ypoint = Ychar;
            }
            DisChar_1207(Xpoint, Ypoint, Char_Offset, col);

            //The next word of the abscissa increases the font of the broadband
            Xpoint += Font_Width;      
        }
    }

    //% blockId=DisNumber
    //% blockGap=8
    //% block="Show number|X %Xnum|Y %Ynum|number %num|Color %Color"
    //% Xnum.min=1 Xnum.max=160 Ynum.min=1 Ynum.max=128 
    //% weight=100
    export function DisNumber(Xnum: number, Ynum: number, num: number, col: COLOR): void {
        let Xpoint = Xnum;
        let Ypoint = Ynum;
        DisString(Xnum, Ynum, num + "", col);
    }

    function DisChar_1207(Xchar: number, Ychar: number, Char_Offset: number, col: COLOR): void {
        let Page = 0, Column = 0;
        let off = Char_Offset
        let charTemp = 0
        //let test1 = Font12_Table[off];
        //basic.showNumber(test1);
        //basic.pause(800)

        for (Page = 0; Page < 12; Page++) {
            for (Column = 0; Column < 7; Column++) {
                charTemp = font12x7.getNumber(NumberFormat.UInt8BE, off);
                if (charTemp & (0x80 >> (Column % 8)))
                //if (Font12_Table[off] & (0x80 >> (Column % 8)))

                   LCD_SetPoint(Xchar + Column, Ychar + Page, col);

                //One pixel is 8 bits, Font_Width = 7
                if (Column % 8 == 7)
                    off++;
            }// Write a line
             if (7 % 8 != 0)    // macht das Sinn ?? 7modulu8 ergibt 7 und ist ungleich 0
                off++;  
        }// Write all   
    }


    function Swop_AB(Point1: number, Point2: number): void {
        let Temp = 0;
        Temp = Point1;
        Point1 = Point2;
        Point2 = Temp;
    }

    // unsed functions for calliope

    //% blockId=Draw_Clear
    //% blockGap=8
    //% block="Clear Display"
    //% weight=80
    export function LCD_ClearDisplay(): void {
        let i;
        pins.digitalWritePin(DigitalPin.P2, 0);

        for (i = 0; i < 160 * 2 * 128; i++) {
            pins.spiWrite(0xff);
        }
        pins.digitalWritePin(DigitalPin.P2, 1);
    }


    /*
         * Activate Display Inversion
         */
    //% block="set Display Inversion Mode %tftMode"
    //% tftMode.shadow="toggleOnOff"
    //% weight=6
    //   INVOFF = 0x20,
    //   INVON = 0x21,
    export function setDisplayInverseMode(tftMode: boolean): void {
        // set display either to normal display mode or inverse display mode
        // Disable inversion
        if (tftMode) {
            LCD_WriteReg(TFTCommands.INVON);
        }
        else {
             LCD_WriteReg(TFTCommands.INVOFF);
        }
    }

    /*
     * Set color scheme
     */
    //% block="Set RBG color scheme of TFT-Display: %cScheme"
    //% weight=5
    export function setColorScheme(cScheme: ColorScheme): void {
        // adjustment of color ordering -> RGB vs BGR
        // RBG-> 0xC0  BGR -> 0xC8
        LCD_WriteReg(TFTCommands.MADCTL);
        LCD_WriteData_8Bit(cScheme);
    }

    
}
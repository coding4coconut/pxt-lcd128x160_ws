input.onButtonEvent(Button.A, ButtonEvent.Click, function () {
    LCD1IN8.DrawCircle(
    80,
    60,
    20,
    36467,
    DRAW_FILL.DRAW_FULL,
    DOT_PIXEL.DOT_PIXEL_2
    )
})
input.onButtonEvent(Button.B, ButtonEvent.Click, function () {
    LCD1IN8.DrawPoint(
    20,
    20,
    57607,
    DOT_PIXEL.DOT_PIXEL_4
    )
})
input.onButtonEvent(Button.AB, ButtonEvent.Click, function () {
    LCD1IN8.DrawRectangle(
    10,
    90,
    150,
    118,
    5285,
    DRAW_FILL.DRAW_EMPTY,
    DOT_PIXEL.DOT_PIXEL_1
    )
})
LCD1IN8.LCD_Init()
LCD1IN8.LCD_Clear()
LCD1IN8.DrawLine(
10,
10,
139,
10,
63519,
DOT_PIXEL.DOT_PIXEL_2,
LINE_STYLE.LINE_DOTTED
)
basic.showIcon(IconNames.Heart)
basic.forever(function () {
	
})

import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/api.service';

@Component({
    selector: 'app-hangman',
    templateUrl: './hangman.component.html'
})
export class HangmanComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('hangmanCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
    private ctx!: CanvasRenderingContext2D;

    @Output() dead: EventEmitter<void> = new EventEmitter<void>();

    constructor(private api: ApiService) {}

    ngOnInit(): void {
        this.api.draw$.subscribe(() => {
            this.drawNextPart();
        });
    }

    ngOnDestroy(): void {
        this.api.draw$.unsubscribe();
    }

    ngAfterViewInit() {
        const canvas = this.canvasRef.nativeElement;
        this.ctx = canvas.getContext('2d')!;
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 4;

        // draw base & pole
        this.ctx.beginPath();
        this.ctx.moveTo(50, 380);
        this.ctx.lineTo(250, 380);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(100, 380);
        this.ctx.lineTo(100, 50);
        this.ctx.stroke();
    }

    drawNextPart() {
        const step = this.drawSteps.shift();
        if (step) step();
    }
      
    private drawSteps = [
        () => this.drawGallows(),
        () => this.drawHead(),
        () => this.drawBody(),
        () => this.drawLeftArm(),
        () => this.drawRightArm(),
        () => this.drawLeftLeg(),
        () => this.drawRightLeg(),
    ];

    private drawGallows() {
        const ctx = this.ctx;

        // Top Beam
        ctx.beginPath();
        ctx.moveTo(100, 50);
        ctx.lineTo(200, 50);
        ctx.stroke();

        // Rope
        ctx.beginPath();
        ctx.moveTo(200, 50);
        ctx.lineTo(200, 100);
        ctx.stroke();
    }

    private drawHead(): void {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.arc(200, 125, 25, 0, Math.PI * 2); // x, y, radius, start, end
        ctx.stroke();
    }

    private drawBody(): void {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(200, 150); // Just below the head
        ctx.lineTo(200, 230); // Length of the torso
        ctx.stroke();
    }

    private drawLeftArm(): void {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(200, 170); // Shoulder
        ctx.lineTo(160, 200); // Hand
        ctx.stroke();
    }

    private drawRightArm(): void {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(200, 170); // Shoulder
        ctx.lineTo(240, 200); // Hand
        ctx.stroke();
    }

    private drawLeftLeg(): void {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(200, 230); // Hip
        ctx.lineTo(170, 280); // Foot
        ctx.stroke();
    }

    private drawRightLeg(): void {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(200, 230); // Hip
        ctx.lineTo(230, 280); // Foot
        ctx.stroke();

        this.dead.emit();
    }
}

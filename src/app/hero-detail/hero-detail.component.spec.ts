import { TestBed, ComponentFixture, fakeAsync, tick, flush } from "@angular/core/testing";
import { HeroDetailComponent } from "./hero-detail.component";
import { ActivatedRoute } from "@angular/router";
import { HeroService } from "../hero.service";
import { Location } from '@angular/common';
import { of } from "rxjs";
import { FormsModule } from "@angular/forms";

describe('HeroDetailComponent', () => {
    let fixture: ComponentFixture<HeroDetailComponent>;
    let mockActivatedRoute, mockHeroService, mockLocation;
    beforeEach(() => {
        mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']);
        mockLocation = jasmine.createSpyObj(['back']);

        mockActivatedRoute = {
            snapshot: {
                paramMap: { get: () => { return '3'}}
            }
        };
        TestBed.configureTestingModule({
            declarations: [ HeroDetailComponent ],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute},
                { provide: HeroService, useValue: mockHeroService },
                { provide: Location, useValue: mockLocation }
            ],
            imports: [ FormsModule ]
        });
        fixture = TestBed.createComponent(HeroDetailComponent);
        mockHeroService.getHero.and.returnValue(of({id: 3, name: 'SuperDude', strenght: 100}));
    });

    it('should render hero name in a h2 tag', () => {
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('h2').textContent).toContain('SUPERDUDE');
    });

    it('should call update hero when save is called', fakeAsync(() => {
        mockHeroService.updateHero.and.returnValue(of({}));
        fixture.detectChanges();
        fixture.componentInstance.save();
        flush();
        expect(mockHeroService.updateHero).toHaveBeenCalled();
    }));
})
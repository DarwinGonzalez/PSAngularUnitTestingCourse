import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroesComponent } from "./heroes.component";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { HeroComponent } from "../hero/hero.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";

describe('Heroes Component (deep tests)', () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES: Hero[];

    beforeEach(() => {
        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

        HEROES = [
            { id: 1, name: 'SpiderDude', strength: 8},
            { id: 2, name: 'Wonderful Woman', strength: 24},
            { id: 3, name: 'BatDude', strength: 55},
        ] as Hero[];

        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent,
                HeroComponent
            ],
            providers: [
                { provide: HeroService, useValue: mockHeroService}
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(HeroesComponent);
    });

    it('should render as a hero as HeroComponent', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        // run ngOnInit() by firing change detector
        fixture.detectChanges();
        const heroesComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        expect(heroesComponentDEs.length).toEqual(3);
        for (let index = 0; index < heroesComponentDEs.length; index++) {
            expect(heroesComponentDEs[index].componentInstance.hero.name).toEqual(HEROES[index].name)
        }
    });
})
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroesComponent } from "./heroes.component";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { HeroComponent } from "../hero/hero.component";
import { NO_ERRORS_SCHEMA, Directive, Input } from "@angular/core";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";

@Directive({
    selector: '[routerLink]',
    host: { '(click)': 'onClick()'}
})
export class RouterLinkDirectiveStub {
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    onClick() {
        this.navigatedTo = this.linkParams;
    }
}

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
                HeroComponent,
                RouterLinkDirectiveStub
            ],
            providers: [
                { provide: HeroService, useValue: mockHeroService}
            ],
            // schemas: [NO_ERRORS_SCHEMA]
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

    it('should call heroService.deleteHero when the Hero Components delete button is clicked', () => {
        spyOn(fixture.componentInstance, 'delete');
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        const heroesComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        for (let index = 0; index < heroesComponentDEs.length; index++) {
            heroesComponentDEs[index].query(By.css('button'))
                .triggerEventHandler('click', { stopPropagation: () => {} });
            expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[index]);
        }
    });

    it('should call heroService.deleteHero when the Hero Components delete button is clicked (other way to do it)', () => {
        spyOn(fixture.componentInstance, 'delete');
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        const heroesComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        (<HeroComponent>heroesComponentDEs[0].componentInstance).delete.emit(undefined);
        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
    });

    it('should call heroService.deleteHero when the Hero Components delete button is clicked (another way to do it)', () => {
        spyOn(fixture.componentInstance, 'delete');
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        const heroesComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        heroesComponentDEs[0].triggerEventHandler('delete', null);
        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
    });

    it('should add a new hero to the hero list when add button is clicked', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        const name: string = 'Mr. Ice';
        mockHeroService.addHero.and.returnValue(of({id: 5, name: name, strenght: 4}));
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        const addButton = fixture.debugElement.queryAll(By.css('button'))[0];
        inputElement.value = name;
        addButton.triggerEventHandler('click', null);
        fixture.detectChanges();
        const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
        expect(heroText).toContain(name);
        expect(fixture.componentInstance.heroes.length).toEqual(4);
    });

    it('should have the correct route for the fisrt hero', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        const heroesComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        let routerLink = heroesComponentDEs[0]
            .query(By.directive(RouterLinkDirectiveStub))
            .injector.get(RouterLinkDirectiveStub);
        heroesComponentDEs[0].query(By.css('a')).triggerEventHandler('click', null);
        expect(routerLink.navigatedTo).toBe('/detail/1');
    });
})
import { HeroesComponent } from "./heroes.component";
import { Hero } from "../hero";
import { of } from "rxjs";

describe('HeroesComponent', () => {
    let component: HeroesComponent;
    let HEROES: Hero[];
    let mockHeroService;

    beforeEach(() => {
        HEROES = [
            { id: 1, name: 'SpiderDude', strength: 8},
            { id: 2, name: 'Wonderful Woman', strength: 24},
            { id: 3, name: 'BatDude', strength: 55},
        ] as Hero[];
        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
        component = new HeroesComponent(mockHeroService);

    });

    describe('delete', () => {
        it('should remove the indicated hero from the heroes list', () => {
            mockHeroService.deleteHero.and.returnValue(of(true));
            component.heroes = HEROES;
            component.delete(HEROES[2]);
            let deletationHasBeenSuccess = component.heroes.some((item: Hero) => item.id === HEROES[2].id);
            expect(component.heroes.length).toBe(2);
            expect(deletationHasBeenSuccess).toBe(false);
        });

        it('should call deleteHero',  () => {
            mockHeroService.deleteHero.and.returnValue(of(true));
            component.heroes = HEROES;
            component.delete(HEROES[2]);
            expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
        });
    });
})
import { TestBed, ComponentFixture } from "@angular/core/testing";
import { HeroComponent } from "./hero.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { By } from "@angular/platform-browser";

describe('HeroComponent (shallow tests)', () => {
    let fixture: ComponentFixture<HeroComponent>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [HeroComponent],
            schemas: [NO_ERRORS_SCHEMA] // This line will tell angular to not error if encountered unknown attr/element
        });
        fixture = TestBed.createComponent(HeroComponent);
    });

    it('should have the correct hero', () => {
        fixture.componentInstance.hero = { id: 1, name: 'SpiderDude', strength: 8};
        expect(fixture.componentInstance.hero.name).toEqual('SpiderDude');
    });

    it('should render the hero name and the anchor tag', () => {
        fixture.componentInstance.hero = { id: 1, name: 'SpiderDude', strength: 8};
        fixture.detectChanges(); // In order to update any binding that may exists on the component
        expect(fixture.nativeElement.querySelector('a').textContent).toContain('SpiderDude'); // nativeElement exposes DOM api
        expect(fixture.debugElement.query(By.css('a')).nativeElement.textContent).toContain('SpiderDude');
    });
})
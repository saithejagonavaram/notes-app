import { NotesAppPage } from './app.po';

describe('notes-app App', function() {
  let page: NotesAppPage;

  beforeEach(() => {
    page = new NotesAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

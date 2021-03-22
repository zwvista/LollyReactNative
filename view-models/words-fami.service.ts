import { WordFamiService } from '../services/wpp/word-fami.service';
import { inject } from 'typedin';
import { EMPTY as empty, Observable } from 'rxjs';

export class WordsFamiService {

  userid = 1;

  @inject private wordFamiService: WordFamiService;

  delete(id: number): Observable<number> {
    return this.wordFamiService.delete(id);
  }


}


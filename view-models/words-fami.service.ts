import { WordFamiService } from '../services/wpp/word-fami.service';
import { EMPTY as empty, Observable } from 'rxjs';

export class WordsFamiService {

  userid = 1;
  wordFamiService = new WordFamiService();

  delete(id: number): Observable<number> {
    return this.wordFamiService.delete(id);
  }


}


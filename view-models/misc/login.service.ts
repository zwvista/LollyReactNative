import { UserService } from '../../services/misc/user.service';
import { MUser } from '../../models/misc/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class LoginService {
  private userService = UserService.Instance;

  item = new MUser();

  login(): Observable<string> {
    return this.userService.getDataByLang(this.item.USERNAME, this.item.PASSWORD).pipe(
      map(res => res.length === 0 ? '' : res[0].USERID)
    );
  }
}

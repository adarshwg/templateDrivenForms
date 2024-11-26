import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  viewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime, subscribeOn } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private form = viewChild.required<NgForm>('form');
  private destroyRef = inject(DestroyRef);
  constructor() {
    afterNextRender(() => {
      const savedForm =window.localStorage.getItem('saved-login-form');
      if(savedForm){
        const loadedFormData = JSON.parse(savedForm);
        const savedEmail = loadedFormData.email;
        setTimeout(()=>{
          this.form().controls['email'].setValue(savedEmail)
        })
        this.form().setValue(
          {
            email: savedEmail,
            password: ''
          }
        )
      }
      const subscription = this.form()
        .valueChanges?.pipe(debounceTime(500))
        .subscribe({
          next: (value) =>
            window.localStorage.setItem(
              'saved-login-form',
              JSON.stringify({
                email: value.email,
                password: value.password,
              })
            ),
        });
      this.destroyRef.onDestroy(() => subscription?.unsubscribe());
    });
  }
  onSubmit(formData: NgForm) {
    if (formData.form.invalid) {
      return;
    }
    const enteredEmail = formData.form.value.email;
    const enteredPassword = formData.form.value.password;
    formData.form.reset();
  }
}

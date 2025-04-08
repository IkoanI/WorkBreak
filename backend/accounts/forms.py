from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.contrib.auth.models import User


class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField()

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')
        unique_together = ('email', 'username')

    def clean_email(self):
        email = self.cleaned_data["email"]

        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Account with this email already exists")

        return email

    def __init__(self, *args, **kwargs):
        super(CustomUserCreationForm, self).__init__(*args, **kwargs)
        placeholders = ['Username','Email', 'Password', 'Confirm Password']
        for i, field in enumerate(['username','email', 'password1', 'password2']):
            self.fields[field].help_text = None
            self.fields[field].widget.attrs.update(
                {'class': 'form-control', 'placeholder': placeholders[i]}
            )
from django import forms
from django.contrib.auth import authenticate
from .models import User

class SignUpForm(forms.ModelForm):
    password = forms.CharField(
        label="Password",
        widget=forms.PasswordInput(attrs={
            'class': 'form-control bg-dark text-light border-secondary',
            'placeholder': 'Enter your password (min 6 characters)'
        }),
        min_length=6
    )
    confirm_password = forms.CharField(
        label="Confirm Password",
        widget=forms.PasswordInput(attrs={
            'class': 'form-control bg-dark text-light border-secondary',
            'placeholder': 'Re-enter your password'
        })
    )

    class Meta:
        model = User
        fields = ['full_name', 'email', 'phone_number', 'password']
        widgets = {
            'full_name': forms.TextInput(attrs={
                'class': 'form-control bg-dark text-light border-secondary',
                'placeholder': 'John Doe'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control bg-dark text-light border-secondary',
                'placeholder': 'john.doe@example.com'
            }),
            'phone_number': forms.TextInput(attrs={
                'class': 'form-control bg-dark text-light border-secondary',
                'placeholder': '+91 98765 43210'
            }),
        }

    def clean_email(self):
        email = self.cleaned_data.get('email').strip().lower()
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("An account with this email address already exists.")
        return email

    def clean_phone_number(self):
        phone = self.cleaned_data.get('phone_number').strip()
        if len(phone) < 8:
            raise forms.ValidationError("Please provide a valid contact phone number.")
        return phone

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('confirm_password')

        if password and confirm_password and password != confirm_password:
            self.add_error('confirm_password', "Passwords do not match.")
        return cleaned_data

class SignInForm(forms.Form):
    email = forms.EmailField(
        label="Email Address",
        widget=forms.EmailInput(attrs={
            'class': 'form-control bg-dark text-light border-secondary',
            'placeholder': 'name@example.com'
        })
    )
    password = forms.CharField(
        label="Password",
        widget=forms.PasswordInput(attrs={
            'class': 'form-control bg-dark text-light border-secondary',
            'placeholder': '••••••••'
        })
    )

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get('email')
        password = cleaned_data.get('password')

        if email and password:
            self.user = authenticate(email=email.strip().lower(), password=password)
            if not self.user:
                raise forms.ValidationError("Invalid email address or password.")
            if not self.user.is_active:
                raise forms.ValidationError("This account has been deactivated.")
        return cleaned_data

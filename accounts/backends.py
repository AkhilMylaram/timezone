from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class EmailAuthBackend(ModelBackend):
    """
    Authenticate against timezone_users in MySQL using email and password.
    Ensures that invalid credentials will never authenticate.
    """
    def authenticate(self, request, username=None, password=None, email=None, **kwargs):
        lookup_email = email or username or kwargs.get(UserModel.USERNAME_FIELD)
        if not lookup_email or not password:
            return None

        lookup_email = lookup_email.strip().lower()

        try:
            user = UserModel.objects.get(email__iexact=lookup_email)
        except UserModel.DoesNotExist:
            # Run the default password hasher once to reduce timing difference
            UserModel().set_password(password)
            return None
        except UserModel.MultipleObjectsReturned:
            user = UserModel.objects.filter(email__iexact=lookup_email).order_by('id').first()

        if user and user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None

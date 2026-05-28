from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from users.models import Country

User = get_user_model()


class RegistrationAPITest(APITestCase):
    def setUp(self):
        self.register_url = reverse('auth-register')
        # Create a test country so SlugRelatedField can resolve it
        Country.objects.create(
            code='KE',
            name='Kenya',
            region=Country.Region.EAST_AFRICA,
            lm_office=True,
            flag_emoji='🇰🇪'
        )

    def test_registration_success(self):
        data = {
            'email': 'teacher@example.com',
            'username': 'teacher_jane',
            'password': 'strongpassword123',
            'first_name': 'Jane',
            'last_name': 'Doe',
            'organization': 'Special Education School',
            'organization_type': 'CSO',
            'professional_title': 'Special Needs Teacher',
            'bio': 'Passionate about inclusive education.',
            'how_heard': 'From a colleague',
            'country': 'Kenya',
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verify database record
        user = User.objects.get(email='teacher@example.com')
        self.assertEqual(user.username, 'teacher_jane')
        self.assertEqual(user.first_name, 'Jane')
        self.assertEqual(user.last_name, 'Doe')
        self.assertEqual(user.organization, 'Special Education School')
        self.assertEqual(user.organization_type, 'CSO')
        self.assertEqual(user.professional_title, 'Special Needs Teacher')
        self.assertEqual(user.bio, 'Passionate about inclusive education.')
        self.assertEqual(user.how_heard, 'From a colleague')
        self.assertEqual(user.country.name, 'Kenya')
        self.assertEqual(user.role, User.Role.MEMBER)
        self.assertFalse(user.is_verified)
        self.assertFalse(user.is_approved)

    def test_registration_missing_required_fields(self):
        data = {
            'email': 'incomplete@example.com',
            'username': 'incomplete_user',
            # missing password
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

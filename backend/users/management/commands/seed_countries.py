from django.core.management.base import BaseCommand
from users.models import Country


class Command(BaseCommand):
    help = 'Seed the 54 African countries plus a fallback option.'

    def handle(self, *args, **options):
        # (ISO 3166-1 alpha-2, name, region, lm_office, flag_emoji)
        countries_data = [
            ('DZ', 'Algeria', Country.Region.NORTH_AFRICA, False, '🇩🇿'),
            ('AO', 'Angola', Country.Region.SOUTHERN_AFRICA, False, '🇦🇴'),
            ('BJ', 'Benin', Country.Region.WEST_AFRICA, False, '🇧🇯'),
            ('BW', 'Botswana', Country.Region.SOUTHERN_AFRICA, False, '🇧🇼'),
            ('BF', 'Burkina Faso', Country.Region.WEST_AFRICA, False, '🇧🇫'),
            ('BI', 'Burundi', Country.Region.EAST_AFRICA, True, '🇧🇮'),
            ('CV', 'Cabo Verde', Country.Region.WEST_AFRICA, False, '🇨🇻'),
            ('CM', 'Cameroon', Country.Region.CENTRAL_AFRICA, False, '🇨🇲'),
            ('CF', 'Central African Republic', Country.Region.CENTRAL_AFRICA, False, '🇨🇫'),
            ('TD', 'Chad', Country.Region.CENTRAL_AFRICA, True, '🇹🇩'),
            ('KM', 'Comoros', Country.Region.EAST_AFRICA, False, '🇰🇲'),
            ('CG', 'Congo', Country.Region.CENTRAL_AFRICA, False, '🇨🇬'),
            ('CI', "Côte d'Ivoire", Country.Region.WEST_AFRICA, False, '🇨🇮'),
            ('CD', 'Democratic Republic of the Congo', Country.Region.CENTRAL_AFRICA, True, '🇨🇩'),
            ('DJ', 'Djibouti', Country.Region.EAST_AFRICA, False, '🇩🇯'),
            ('EG', 'Egypt', Country.Region.NORTH_AFRICA, False, '🇪🇬'),
            ('GQ', 'Equatorial Guinea', Country.Region.CENTRAL_AFRICA, False, '🇬🇶'),
            ('ER', 'Eritrea', Country.Region.EAST_AFRICA, False, '🇪🇷'),
            ('SZ', 'Eswatini', Country.Region.SOUTHERN_AFRICA, False, '🇸🇿'),
            ('ET', 'Ethiopia', Country.Region.EAST_AFRICA, True, '🇪🇹'),
            ('GA', 'Gabon', Country.Region.CENTRAL_AFRICA, False, '🇬🇦'),
            ('GM', 'Gambia', Country.Region.WEST_AFRICA, False, '🇬🇲'),
            ('GH', 'Ghana', Country.Region.WEST_AFRICA, False, '🇬🇭'),
            ('GN', 'Guinea', Country.Region.WEST_AFRICA, False, '🇬🇳'),
            ('GW', 'Guinea-Bissau', Country.Region.WEST_AFRICA, False, '🇬🇼'),
            ('KE', 'Kenya', Country.Region.EAST_AFRICA, True, '🇰🇪'),
            ('LS', 'Lesotho', Country.Region.SOUTHERN_AFRICA, False, '🇱🇸'),
            ('LR', 'Liberia', Country.Region.WEST_AFRICA, False, '🇱🇷'),
            ('LY', 'Libya', Country.Region.NORTH_AFRICA, False, '🇱🇾'),
            ('MG', 'Madagascar', Country.Region.SOUTHERN_AFRICA, False, '🇲🇬'),
            ('MW', 'Malawi', Country.Region.SOUTHERN_AFRICA, False, '🇲🇼'),
            ('ML', 'Mali', Country.Region.WEST_AFRICA, True, '🇲🇱'),
            ('MR', 'Mauritania', Country.Region.WEST_AFRICA, False, '🇲🇷'),
            ('MU', 'Mauritius', Country.Region.SOUTHERN_AFRICA, False, '🇲🇺'),
            ('MA', 'Morocco', Country.Region.NORTH_AFRICA, False, '🇲🇦'),
            ('MZ', 'Mozambique', Country.Region.SOUTHERN_AFRICA, False, '🇲🇿'),
            ('NA', 'Namibia', Country.Region.SOUTHERN_AFRICA, False, '🇳🇦'),
            ('NE', 'Niger', Country.Region.WEST_AFRICA, True, '🇳🇪'),
            ('NG', 'Nigeria', Country.Region.WEST_AFRICA, False, '🇳🇬'),
            ('RW', 'Rwanda', Country.Region.EAST_AFRICA, True, '🇷🇼'),
            ('ST', 'Sao Tome and Principe', Country.Region.CENTRAL_AFRICA, False, '🇸🇹'),
            ('SN', 'Senegal', Country.Region.WEST_AFRICA, False, '🇸🇳'),
            ('SC', 'Seychelles', Country.Region.EAST_AFRICA, False, '🇸🇨'),
            ('SL', 'Sierra Leone', Country.Region.WEST_AFRICA, False, '🇸🇱'),
            ('SO', 'Somalia', Country.Region.EAST_AFRICA, True, '🇸🇴'),
            ('ZA', 'South Africa', Country.Region.SOUTHERN_AFRICA, False, '🇿🇦'),
            ('SS', 'South Sudan', Country.Region.EAST_AFRICA, True, '🇸🇸'),
            ('SD', 'Sudan', Country.Region.NORTH_AFRICA, True, '🇸🇩'),
            ('TZ', 'Tanzania', Country.Region.EAST_AFRICA, True, '🇹🇿'),
            ('TG', 'Togo', Country.Region.WEST_AFRICA, False, '🇹🇬'),
            ('TN', 'Tunisia', Country.Region.NORTH_AFRICA, False, '🇹🇳'),
            ('UG', 'Uganda', Country.Region.EAST_AFRICA, True, '🇺🇬'),
            ('ZM', 'Zambia', Country.Region.SOUTHERN_AFRICA, False, '🇿🇲'),
            ('ZW', 'Zimbabwe', Country.Region.SOUTHERN_AFRICA, False, '🇿🇼'),
            ('--', 'Other African Country', Country.Region.EAST_AFRICA, False, '🌍'),
        ]

        count = 0
        for code, name, region, lm_office, flag in countries_data:
            obj, created = Country.objects.update_or_create(
                code=code,
                defaults={
                    'name': name,
                    'region': region,
                    'lm_office': lm_office,
                    'flag_emoji': flag,
                }
            )
            if created:
                count += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {count} new countries. Total countries: {Country.objects.count()}'))

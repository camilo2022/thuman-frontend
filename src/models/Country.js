import Setting from "@/components/templates/Internal/Setting/PhoneValidation/Setting.vue";

export default class Country {
    constructor({
        id = null,
        subregion_id = null,
        name = '',
        iso3 = '',
        iso2 = '',
        numeric_code = '',
        phone_code = '',
        currency = '',
        currency_name = '',
        currency_symbol = '',
        tld = '',
        native = '',
        nationality = '',
        latitude = '',
        longitude = '',
        emoji = '',
        emojiU = '',
        translations = {},
        settings = {
            validations: []
        }
    } = {}) {
        this.id = id;
        this.subregion_id = subregion_id;
        this.name = name;
        this.iso3 = iso3;
        this.iso2 = iso2;
        this.numeric_code = numeric_code;
        this.phone_code = phone_code;
        this.currency = currency;
        this.currency_name = currency_name;
        this.currency_symbol = currency_symbol;
        this.tld = tld;
        this.native = native;
        this.nationality = nationality;
        this.latitude = latitude;
        this.longitude = longitude;
        this.emoji = emoji;
        this.emojiU = emojiU;
        this.translations = translations;
        this.settings = settings;
    }
}
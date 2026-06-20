package com.rehab.rehab_center_api.converters;

import com.rehab.rehab_center_api.enums.DrugType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.text.Normalizer;
import java.util.Locale;

@Converter
public class DrugTypeConverter implements AttributeConverter<DrugType, String> {

    @Override
    public String convertToDatabaseColumn(DrugType attribute) {
        return attribute == null ? null : attribute.name();
    }

    @Override
    public DrugType convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return null;
        }

        String normalized = Normalizer.normalize(dbData.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toUpperCase(Locale.ROOT)
                .replace('-', '_')
                .replace(' ', '_');

        return switch (normalized) {
            case "HEROIN" -> DrugType.HEROIN;
            case "MA_TUY_DA", "METH", "METHAMPHETAMINE" -> DrugType.MA_TUY_DA;
            case "THUOC_LAC", "ECSTASY" -> DrugType.THUOC_LAC;
            case "CAN_SA", "CANNABIS", "MARIJUANA" -> DrugType.CAN_SA;
            case "KETAMINE" -> DrugType.KETAMINE;
            default -> DrugType.KHAC;
        };
    }
}

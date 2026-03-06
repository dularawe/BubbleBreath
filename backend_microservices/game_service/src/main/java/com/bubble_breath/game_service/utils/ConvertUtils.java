package com.bubble_breath.game_service.utils;
import java.text.SimpleDateFormat;
import java.util.Date;
public class ConvertUtils {
    private static final String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
    public static String convertDateToStr(Date date) {
        if (date == null) return null;
        return new SimpleDateFormat(DATE_FORMAT).format(date);
    }
}

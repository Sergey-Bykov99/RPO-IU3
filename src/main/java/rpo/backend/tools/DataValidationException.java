package rpo.backend.tools;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
public class DataValidationException extends Exception {
    public DataValidationException(String message) {super(message);}
}
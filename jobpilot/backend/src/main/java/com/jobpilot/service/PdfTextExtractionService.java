package com.jobpilot.service;

import com.jobpilot.exception.BadRequestException;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class PdfTextExtractionService {

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public String extractText(String fileUrl) {
        byte[] pdfBytes = download(fileUrl);

        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        } catch (IOException e) {
            throw new BadRequestException("Unable to read resume PDF");
        }
    }

    private byte[] download(String fileUrl) {
        try {
            HttpRequest request = HttpRequest.newBuilder(URI.create(fileUrl)).GET().build();
            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
            if (response.statusCode() != 200) {
                throw new BadRequestException("Unable to download resume file");
            }
            return response.body();
        } catch (IOException | InterruptedException e) {
            throw new BadRequestException("Unable to download resume file");
        }
    }
}

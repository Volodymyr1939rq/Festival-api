package com.university.festival_api.services;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import com.university.festival_api.models.Participant;

@Service
public class ExcelReportService {
    
    public byte[] createExcelFile(List<Participant> participants){
        try (Workbook workbook=new XSSFWorkbook();
        ByteArrayOutputStream out=new ByteArrayOutputStream()){
        Sheet sheet=workbook.createSheet("Festival Sheet");
        Row headerRow=sheet.createRow(0);
        String[] colums={"ID", "Ім'я", "Прізвище", "Група", "Жанр", "Тур 1", "Тур 2", "Тур 3", "Загальний бал"};
        for(int i=0;i<colums.length;i++){
            Cell cell=headerRow.createCell(i);
            cell.setCellValue(colums[i]);
        }
        int rowNumber=1;
        for(Participant participant : participants){
            Row row=sheet.createRow(rowNumber++);
            row.createCell(0).setCellValue(participant.getId().toString());
            row.createCell(1).setCellValue(participant.getFirstName());
            row.createCell(2).setCellValue(participant.getLastName());
            row.createCell(3).setCellValue(participant.getGroupName());
            row.createCell(4).setCellValue(participant.getPerformanceGenre());
            row.createCell(5).setCellValue(participant.getTour1Score());
            row.createCell(6).setCellValue(participant.getTour2Score());
            row.createCell(7).setCellValue(participant.getTour3Score());

            int totalScore=participant.getTour1Score()+participant.getTour2Score()+participant.getTour3Score();
            row.createCell(8).setCellValue(totalScore);
        }
        for(int i=0;i<colums.length;i++){
            sheet.autoSizeColumn(i);
        }
            workbook.write(out);
            System.out.println("Excel файл успішно створено!");
            return out.toByteArray();
        } catch (IOException e) {
            System.err.println("Помилка створення Excel: " + e.getMessage());
            return null;
        }
    }
}

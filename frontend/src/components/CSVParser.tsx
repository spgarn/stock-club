import React, { useCallback } from 'react';
import { TextField } from '@mui/material';
import { Card, CardContent, Typography } from '@mui/material';
import Papa from 'papaparse';
import { translate } from '../i18n';

// Define types for the CSV parsing results
interface ParseResult<T> {
    data: T[];
    errors: Papa.ParseError[];
    meta: Papa.ParseMeta;
}

// Generic type for CSV row data
export interface CSVRow {
    [key: string]: string | number;
}

const CSVParser = ({ parseData }: { parseData: (data: CSVRow[]) => void }) => {
    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            Papa.parse<CSVRow>(file, {
                complete: (results: ParseResult<CSVRow>) => {
                    console.log('Parsed CSV data:', results.data);
                    parseData(results.data);

                    // Handle any parsing errors
                    if (results.errors.length > 0) {
                        console.error('Parsing errors:', results.errors);
                    }
                },
                header: true,
                skipEmptyLines: true,
                error: (error: unknown) => {
                    console.error('Error parsing CSV:', error);
                }
            });
        }
    }, []);

    return (
        <Card sx={{ maxWidth: 500 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    {translate["choose_csv_file"]}
                </Typography>
                <TextField
                    type="file"
                    slotProps={{ htmlInput: { accept: '.csv' } }}
                    onChange={handleFileChange}
                    fullWidth
                    variant="outlined"
                />
            </CardContent>
        </Card>
    );
};

export default CSVParser;
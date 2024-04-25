import * as React from 'react';
import { Card, styled } from '@mui/material';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import ICard from '../../Interface/ICard';

interface param{
    text:any,
    onChange:any
}
const StyledCard = styled(Card)`
  width: 300px;
  margin: 10px;
`;
// eslint-disable-next-line
export default function CardEdit (parametro:param)  {
  const [cardText, setCardText] = useState(parametro.text);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCardText(event.target.value);
    parametro.onChange(event.target.value);
  };

  return (
    <StyledCard>
      <CardContent>
        <TextField
          label="Digite algo..."
          variant="outlined"
          value={cardText}
          onChange={handleTextChange}
        />
      </CardContent>
    </StyledCard>
  );
};



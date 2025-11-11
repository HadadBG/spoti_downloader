package com.example.musicHub.util;

import java.util.Calendar;

public class Encoder {
        public static String decode(String strFile) {
    String strPass = ""; String strBuffer = "";
    int iCoe = 0; int iCode = 0;
    try
    {
      strBuffer = strFile;
      iCoe = Integer.parseInt(strBuffer.substring(0, 4));
      for (int x = 4; x < strBuffer.length() - 8; x += 4)
      {
        iCode = Integer.parseInt(strBuffer.substring(x, x + 4));
        iCode -= iCoe;
        strPass = strPass + (char)iCode;
      }
    }
    catch (Exception e)
    {
      System.out.print("Error en GetPassword()");
      System.out.println(e.toString());
    }
    return strPass;
  }
 public static String encode( String strPass)
  {
   
    int iCoe = 0;
    String strBuffer = "";
  
    Calendar cal = Calendar.getInstance();
    iCoe = cal.get(12);
    strBuffer = PadLeft(Integer.toString(iCoe), '0', 4);
    try
    {
      byte[] btPass = strPass.getBytes();
      int iAux = 0;
      for (int x = 0; x < btPass.length; x++)
      {
        iAux = btPass[x] + iCoe;
        strBuffer = strBuffer + PadLeft(String.valueOf(iAux), '0', 4);
      }
     
      strBuffer = strBuffer + PadLeft(Integer.toString(cal.get(5) + iCoe), '0', 2);
      strBuffer = strBuffer + PadLeft(Integer.toString(cal.get(2) + iCoe + 1), '0', 2);
      strBuffer = strBuffer + PadLeft(Integer.toString(cal.get(1) + iCoe), '0', 4);
      
     
    }
    catch (Exception e)
    {
    
      e.printStackTrace();
      System.out.println(e.toString());
    }
  return strBuffer;
  }
  public static String PadLeft(String strBuffer, char szFill, int iLength)
  {
    String strOut = ""; String strAux = "";
    int iLeft = 0;
    iLeft = iLength - strBuffer.length();
    if (iLeft > 0)
      for (int x = 1; x <= iLeft; x++)
        strAux = strAux + szFill;
    strOut = strAux + strBuffer;
    return strOut;
  }
}

package com.binn328.ym_player.Util.Acoustid;

/**
 * chromaprint
 */
public class ChromaPrint {
   final String chromaprint;
   final String duration;

   public ChromaPrint(String chromaprint, String duration) {
      this.duration = duration;
      this.chromaprint = chromaprint;
   }

   public String getChromaprint() {
      return chromaprint;
   }

   public String getDuration() {
      return duration;
   }
}
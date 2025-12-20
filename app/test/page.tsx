/* eslint-disable @typescript-eslint/no-unused-vars */
// app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Calendar,
  MapPin,
  Building,
  CalendarDays,
  Eye,
  Save,
  Download,
  Printer,
  ExternalLink,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExhibitionData, scrapeExhibitions } from "../_actions/scrape";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExhibitionData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedExhibition, setSelectedExhibition] =
    useState<ExhibitionData | null>(null);
  const [savedExhibitions, setSavedExhibitions] = useState<ExhibitionData[]>(
    []
  );

  const handleScrape = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await scrapeExhibitions();
      setData(result);
    } catch (error) {
      console.error("Hata:", error);
      setError("Veri çekme başarısız. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleDetails = (exhibition: ExhibitionData) => {
    setSelectedExhibition(exhibition);
  };

  const handleSave = (exhibition: ExhibitionData) => {
    if (
      !savedExhibitions.some((item) => item.fairName === exhibition.fairName)
    ) {
      setSavedExhibitions((prev) => [...prev, exhibition]);
      alert(`${exhibition.fairName} kaydedildi!`);
    } else {
      alert("Bu fuar zaten kayıtlı!");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Bilinmiyor";
    return dateString;
  };

  const getCycleBadgeVariant = (cycle: string) => {
    const cycleLower = cycle.toLowerCase();
    if (cycleLower.includes("yıllık")) return "default";
    if (cycleLower.includes("iki yılda bir")) return "secondary";
    if (cycleLower.includes("çeyreklik")) return "outline";
    return "secondary";
  };

  const translateCycle = (cycle: string) => {
    const cycleLower = cycle.toLowerCase();
    if (cycleLower.includes("annual")) return "Yıllık";
    if (cycleLower.includes("biennial")) return "İki Yılda Bir";
    if (cycleLower.includes("quarterly")) return "Çeyreklik";
    return cycle;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Başlık */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Fuar ve Ticaret Fuarı Veri Toplayıcı
          </h1>
          <p className="text-gray-600 mt-2">
            Eventseye&apos;den fuar verilerini otomatik olarak toplayın ve
            görüntüleyin
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() =>
              alert(`Kayıtlı ${savedExhibitions.length} fuar bulunuyor`)
            }
          >
            <Save className="h-4 w-4" />
            Kayıtlı Fuarlar ({savedExhibitions.length})
          </Button>
          <Button
            onClick={handleScrape}
            disabled={loading}
            size="lg"
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Veri Toplanıyor...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Fuarları Topla
              </>
            )}
          </Button>
        </div>
      </div>

      {/* İstatistik Kartları */}
      {data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Toplam Fuar Sayısı</p>
                  <p className="text-2xl font-bold">{data.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Farklı Mekanlar</p>
                  <p className="text-2xl font-bold">
                    {new Set(data.map((item) => item.venue)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CalendarDays className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Yıllık Fuarlar</p>
                  <p className="text-2xl font-bold">
                    {
                      data.filter((item) =>
                        item.cycle.toLowerCase().includes("annual")
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Info className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Çin&apos;deki Fuarlar</p>
                  <p className="text-2xl font-bold">{data.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hata Mesajı */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-600 font-medium">{error}</div>
          </CardContent>
        </Card>
      )}

      {/* Tablo */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Fuar Listesi</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Toplanan ticaret fuarları ve etkinlikleri
            </p>
          </div>
          {data.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                Yazdır
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const csvContent = [
                    [
                      "Fuar Adı",
                      "Sıklık",
                      "Mekan",
                      "Başlangıç Tarihi",
                      "Bitiş Tarihi",
                      "Açıklama",
                      "Tarih",
                    ],
                    ...data.map((item) => [
                      item.fairName,
                      translateCycle(item.cycle),
                      item.venue,
                      item.startDate,
                      item.endDate,
                      item.description,
                      item.date,
                    ]),
                  ]
                    .map((row) => row.join(";"))
                    .join("\n");

                  const blob = new Blob([csvContent], {
                    type: "text/csv;charset=utf-8;",
                  });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "cin-fuarlari.csv";
                  a.click();
                }}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                CSV İndir
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {data.length === 0 && !loading ? (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Henüz fuar verisi toplanmadı
              </h3>
              <p className="text-gray-500 mb-6">
                &quot;Fuarları Topla&quot; butonuna tıklayarak veri toplamaya
                başlayın
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Fuar Adı</TableHead>
                    <TableHead className="w-[100px]">Sıklık</TableHead>
                    <TableHead className="w-[150px]">Mekan</TableHead>
                    <TableHead className="w-[120px]">Başlangıç</TableHead>
                    <TableHead className="w-[120px]">Bitiş</TableHead>
                    <TableHead>Açıklama</TableHead>
                    <TableHead className="w-[180px]">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                        <p className="mt-2 text-gray-500">
                          Veriler toplanıyor...
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((exhibition, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div className="font-semibold text-gray-900">
                            {exhibition.fairName || "Bilinmiyor"}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {exhibition.date}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getCycleBadgeVariant(exhibition.cycle)}
                          >
                            {translateCycle(exhibition.cycle)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="truncate">
                              {exhibition.venue || "Bilinmiyor"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{formatDate(exhibition.startDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{formatDate(exhibition.endDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {exhibition.description || "Açıklama bulunmuyor"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {/* Detay Butonu */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2"
                                  onClick={() => handleDetails(exhibition)}
                                >
                                  <Eye className="h-3 w-3" />
                                  Detay
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="text-xl">
                                    {exhibition.fairName}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Fuar detayları ve bilgileri
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-6 py-4">
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-medium text-sm text-gray-500 mb-1">
                                        Sıklık
                                      </h4>
                                      <p className="font-medium">
                                        {translateCycle(exhibition.cycle)}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-sm text-gray-500 mb-1">
                                        Tarih Aralığı
                                      </h4>
                                      <p className="font-medium">
                                        {exhibition.date}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-sm text-gray-500 mb-1">
                                        Başlangıç Tarihi
                                      </h4>
                                      <p className="font-medium">
                                        {exhibition.startDate}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-sm text-gray-500 mb-1">
                                        Bitiş Tarihi
                                      </h4>
                                      <p className="font-medium">
                                        {exhibition.endDate}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-medium text-sm text-gray-500 mb-1">
                                        Mekan
                                      </h4>
                                      <p className="font-medium">
                                        {exhibition.venue}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-sm text-gray-500 mb-1">
                                        Açıklama
                                      </h4>
                                      <p className="text-sm text-gray-700">
                                        {exhibition.description}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-sm text-gray-500 mb-1">
                                        Durum
                                      </h4>
                                      <Badge
                                        variant="outline"
                                        className="bg-green-50 text-green-700 border-green-200"
                                      >
                                        Aktif
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-3 justify-end pt-4 border-t">
                                  <Button
                                    variant="outline"
                                    onClick={() => handleSave(exhibition)}
                                  >
                                    <Save className="h-4 w-4 mr-2" />
                                    Kaydet
                                  </Button>
                                  <Button>
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Siteyi Ziyaret Et
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>

                            {/* Kaydet Butonu */}
                            <Button
                              variant="default"
                              size="sm"
                              className="gap-2 bg-green-600 hover:bg-green-700"
                              onClick={() => handleSave(exhibition)}
                              disabled={savedExhibitions.some(
                                (item) => item.fairName === exhibition.fairName
                              )}
                            >
                              <Save className="h-3 w-3" />
                              {savedExhibitions.some(
                                (item) => item.fairName === exhibition.fairName
                              )
                                ? "Kayıtlı"
                                : "Kaydet"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Sonuç Özeti */}
          {data.length > 0 && !loading && (
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
              <div>
                Toplam <span className="font-medium">{data.length}</span> fuar
                görüntüleniyor
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Yıllık</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span>İki Yılda Bir</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Kayıtlı Fuarlar Bölümü */}
      {savedExhibitions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="h-5 w-5 text-green-600" />
              Kayıtlı Fuarlar ({savedExhibitions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedExhibitions.map((exhibition, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{exhibition.fairName}</h4>
                      <p className="text-sm text-gray-500">
                        {exhibition.date} • {exhibition.venue}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSavedExhibitions((prev) =>
                        prev.filter(
                          (item) => item.fairName !== exhibition.fairName
                        )
                      );
                    }}
                  >
                    Kaldır
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alt Bilgi */}
      <div className="text-sm text-gray-500 text-center pt-4 border-t">
        <p>
          Veriler Eventseye.com&apos;dan alınmaktadır | Son güncelleme:{" "}
          {new Date().toLocaleDateString("tr-TR")}
        </p>
        <p className="text-xs mt-1">
          Çin&apos;de düzenlenen ticaret fuarları ve sergiler
        </p>
      </div>
    </div>
  );
};

export default Page;

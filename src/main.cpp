#include <iostream>
#include <vector>
#include <algorithm>
#include <iomanip>
#include <climits>
using namespace std;
struct Process {
    int pid;
    int arrivalTime;
    int burstTime;
    int priority;
    int waitingTime;
    int turnaroundTime;
};
void takeProcessInput(vector<Process>& processes, int& n) {
    cout << "Enter the number of processes: ";
    cin >> n;

    for (int i = 0; i < n; ++i) {
        Process p;
        p.pid = i + 1;
        cout << "Enter arrival time of Process " << p.pid << ": ";
        cin >> p.arrivalTime;
        cout << "Enter burst time of Process " << p.pid << ": ";
        cin >> p.burstTime;
        cout << "Enter priority of Process " << p.pid << ": ";
        cin >> p.priority;
        processes.push_back(p);
    }
}

bool compareArrival(const Process& a, const Process& b) {
    return a.arrivalTime < b.arrivalTime;
}

int main() {
    vector<Process> processes;
    int n;
    cout << "=== Hybrid CPU Scheduler (SJF + Priority) ===" << endl;
    takeProcessInput(processes, n);
    sort(processes.begin(), processes.end(), compareArrival);

    cout << "\n[Info] Processes sorted by arrival time.\n";
    return 0;
}

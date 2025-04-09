#include <iostream>
#include <vector>
using namespace std;
struct Process {
    int pid;
    int arrivalTime;
    int burstTime;
    int priority;
};
int main() {
    int n;
    cout << "Enter number of processes: ";
    cin >> n;
    vector<Process> processes(n);
    for (int i = 0; i < n; ++i) {
        cout << "\nProcess " << i + 1 << ":\n";
        processes[i].pid = i + 1;
        cout << "Arrival Time: ";
        cin >> processes[i].arrivalTime;
        cout << "Burst Time: ";
        cin >> processes[i].burstTime;
        cout << "Priority (Lower = Higher Priority): ";
        cin >> processes[i].priority;
    }
    cout << "\nEntered Process Data:\n";
    for (const auto& p : processes) {
        cout << "PID: " << p.pid << ", Arrival: " << p.arrivalTime 
             << ", Burst: " << p.burstTime << ", Priority: " << p.priority << "\n";
    }
    return 0;
}
